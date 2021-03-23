import "./step_definitions/given.js";
import "./step_definitions/when.js";
import "./step_definitions/then.js";

import { matchStep } from "./bdd.js";

document.addEventListener("DOMContentLoaded", function () {

    const url = new URL(document.location);
    if (url.searchParams.has("self-test")) {
        initSelfTesting();
    }

});

document.addEventListener("click", e => {
    const target = e.target;
    if (target.tagName === "A" && target.classList.contains("self-test")) {
        e.preventDefault();
        history.replaceState(null, null, target.href);
        initSelfTesting();
    }
})

async function initSelfTesting() {

    const resp = await fetch("/features");
    const json = await resp.json();

    const pickles = json.reduce((index, x) => ("pickle" in x) ? [...index, x.pickle] : index, []);
    const pickleSteps = pickles.reduce((index, p) => {
        index = { ...index };
        p.steps.forEach(pickleStep => {
            pickleStep.astNodeIds.forEach(nodeId => {
                index[nodeId] = pickleStep;
            });
        });
        return index;
    }, {});

    async function runStep(step, keywordContext, scenarioContext) {
        let contextFreeStep = step;
        if (step.keyword === "But ")
            contextFreeStep = { ...step, keyword: keywordContext };
        else if (step.keyword === "And ")
            contextFreeStep = { ...step, keyword: keywordContext };
        else
            keywordContext = step.keyword;

        try {
            const matched = matchStep(contextFreeStep, pickleSteps);
            if (matched) {
                const params = (matched.params || []);
                if (step.docString)
                    params.push(step.docString.content);
                await matched.impl.apply(scenarioContext, params);
            } else {
                throw new Error(`Please implement: ${step.text}`);
            }
        } catch (err) {
            err.step = step;
            err.originalStack = err.stack;
            throw err;
        }
        return keywordContext;
    }

    const features = json
        .map(x => [x.gherkinDocument?.uri, x.gherkinDocument?.feature])
        .filter(x => x[1])
        .map(([uri, feature]) => {
            const background = feature.children.find(x => "background" in x)?.background;
            const scenarios = feature.children
                .map(x => x.scenario)
                .filter(x => x)
                .map(x => ({
                    id: x.id,
                    name: x.name,
                    steps: [
                        ...background?.steps || [],
                        ...x.steps || []
                    ]
                }));
            return {
                id: uri.substring(uri.indexOf("features") + 9).replace(/\W/g, "_"),
                name: feature.name,
                tags: feature.tags?.map(t => t.name),
                description: feature.description,
                scenarios
            };
        });

    const testDiagnostics = document.querySelector("test-diagnostics");

    testDiagnostics.features(features);
    testDiagnostics.open(() => {
        const url = new URL(location.href);
        url.searchParams.delete("self-test");
        history.replaceState(null, null, url.toString());
    });

    for (let feature of features) {

        for (let scenario of feature.scenarios) {

            const scenarioContext = {};
            let keywordContext = null;
            try {
                for (let step of scenario.steps) {
                    testDiagnostics.running(feature.id, scenario.id, step.id);
                    keywordContext = await runStep(step, keywordContext, scenarioContext);
                    testDiagnostics.succeeded();
                }
            } catch (err) {
                testDiagnostics.failed(err.originalStack || err.stack);
            }

        }

    }

}