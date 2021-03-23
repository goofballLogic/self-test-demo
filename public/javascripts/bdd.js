const registry = {
    given: {},
    when: {},
    then: {},
};

const Given = (what, strategy) => { registry.given[what] = strategy; };
const When = (what, strategy) => { registry.when[what] = strategy; };
const Then = (what, strategy) => { registry.then[what] = strategy; };

function matchStep(step, pickleSteps) {

    switch (step.keyword.trim()) {
        case "Given":
            return matchStepForKeyword(registry.given);
        case "When":
            return matchStepForKeyword(registry.when);
        case "Then":
            return matchStepForKeyword(registry.then);
        default:
            throw new Error(`Not handled: ${step.keyword}`);
    }

    function matchStepForKeyword(definitions) {
        const pickleStep = pickleSteps[step.id];
        // for each potential expression match
        for (let expr of pickleStep.expr) {
            let matchedDefinition = null;
            // go through the definitions and try to find one
            for (let def of Object.entries(definitions)) {
                matchedDefinition = matchDefinitionWithExpression(def, expr);
                if (matchedDefinition) return matchedDefinition;
            }
        }
    }

    function matchDefinitionWithExpression([key, impl], expr) {
        const { expressionTemplate, parameterTypes } = expr;
        if (key === expressionTemplate) {
            return {
                key,
                impl,
                expr
            };
        }
        const keyExpression = key.replace(/\{[^}]*\}/g, "([^}]*)");
        const regularExpression = expressionTemplate.replace(/\{%s\}/g, "([^}]*)");
        if (regularExpression === keyExpression) {
            const matched = new RegExp(regularExpression).exec(step.text);
            if (isParameterMatch(matched, parameterTypes)) {
                return {
                    key,
                    impl,
                    expr,
                    params: parseParameters(parameterTypes, matched)
                };
            }
        }

    }

}
export { Given, When, Then, matchStep };

function parseParameters(parameterTypes, matched) {
    return parameterTypes.map((parameterType, i) => {
        switch (parameterType.name) {
            case "int":
            case "float":
                return Number(matched[i + 1]);
            case "string":
                return matched[i + 1].replace(/^"(.*)"$/, "$1");
            default:
                throw new Error("Not handled: " + parameterType.name);
        }
    });
}

function isParameterMatch(matched, parameterTypes) {
    if (!matched) return false;
    const params = Array.from(matched).slice(1);
    if (parameterTypes.length !== params.length)
        return false;
    for (let i = 0; i < parameterTypes.length; i++) {
        const acceptable = parameterTypes[i].regexpStrings;
        const candidate = params[i];
        if (!acceptable.some(x => new RegExp(x).test(candidate)))
            return false;
    }
    return true;
}
