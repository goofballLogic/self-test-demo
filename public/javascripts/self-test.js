import "./step_definitions/given.js";
import "./step_definitions/when.js";
import "./step_definitions/then.js";

import ansispan from "./ansispan.js";
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

    document.querySelector("test-diagnostics").open(() => {
        const url = new URL(location.href);
        url.searchParams.delete("self-test");
        history.replaceState(null, null, url.toString());
    });

    const output = dialog.querySelector(".output");
    output.innerHTML = "";

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
            console.log(matched);
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

    try {
        for (let processStep of json) {
            if (processStep.gherkinDocument) {

                const feature = processStep.gherkinDocument.feature;
                const section = el("SECTION",
                    el("H3", `Feature: ${feature.name}`),
                    ...feature.description.split("\n").map(x => el("DIV.step", x.trim()))
                );
                output.appendChild(section);
                const background = processStep.gherkinDocument.feature.children.find(x => "background" in x)?.background;
                for (let child of processStep.gherkinDocument.feature.children) {
                    if (child.scenario) {

                        const scenarioContext = {};
                        const scenario = child.scenario;
                        let keywordContext = null;
                        const scenarioDiv = el("DIV.scenario.pending",
                            el("H4.status-light", `Scenario: ${scenario.name}`)
                        );
                        section.append(scenarioDiv);
                        try {
                            const steps = [
                                ...(background?.steps || []),
                                ...(scenario.steps || [])
                            ];
                            for (let step of steps) {
                                const stepDiv = el("DIV.step.status-light", `${step.keyword}${step.text}`);
                                try {
                                    scenarioDiv.appendChild(stepDiv);
                                    keywordContext = await runStep(step, keywordContext, scenarioContext, scenarioDiv);
                                } finally {
                                    stepDiv.classList.remove("status-light");
                                }
                            }
                            scenarioDiv.classList.add("ok");
                        } catch (err) {
                            scenarioDiv.appendChild(el("DIV.step",
                                el("PRE.error", ansispan(err.originalStack))
                            ));
                            scenarioDiv.classList.add("fail");
                        } finally {
                            scenarioDiv.classList.remove("pending");
                        }

                    }
                }
            }
        }
    } catch (err) {
        output.innerHTML = output.innerHTML + `<h4>Error</h4><pre>${ansispan(err.stack)}</pre>`;
    }

}

function el(tag) {
    tag = tag.split(".");
    const x = document.createElement(tag[0]);
    for (var i = 1; i < tag.length; i++) {
        x.classList.add(tag[i]);
    }
    for (var i = 1; i < arguments.length; i++) {
        const y = arguments[i];
        if (typeof y !== "string") {
            x.appendChild(y);
        } else {
            x.innerHTML = x.innerHTML + y;
        }
    }
    return x;
}



