import el from "./el.js";
import ansispan from "./ansispan.js";

const { url } = import.meta;
const pathRoot = url.substring(0, url.lastIndexOf("/"));

const css = el("LINK");
css.setAttribute("rel", "stylesheet");
css.setAttribute("href", `${pathRoot}/test-diagnostics.css`);

const monitorIcon = el("IMG");
monitorIcon.setAttribute("src", `${pathRoot}/monitor.svg`);
monitorIcon.setAttribute("width", 20);

function render(root) {
    root.appendChild(css.cloneNode(true));
    root.appendChild(el("DIALOG.diagnostics",
        el("DIV.container",
            el("HEADER",
                monitorIcon.cloneNode(true),
                el("H2", "Dashboard")
            ),
            el("DIV.output")
        )
    ));
}

function setDependentStatuses(feature, scenario, step) {
    if (step.classList.contains("failed")) {
        scenario.classList.add("failed");
        feature.classList.add("failed");
    } else {
        if (Array.from(scenario.querySelectorAll(".steps li")).every(stepx => stepx.classList.contains("succeeded"))) {
            scenario.classList.add("succeeded");
            if (Array.from(feature.querySelectorAll(".scenarios li")).every(scenariox => scenariox.classList.contains("succeeded"))) {
                feature.classList.add("succeeded");
            }
        }
    }
}

function taggedStatusBadge(tags) {
    const statusTag = tags?.find(t => t.startsWith("@status(") && t.endsWith(")"));
    return statusTag && statusTag.substring(8, statusTag.length - 1);
}

function statusClassSelector(tags) {
    const badge = taggedStatusBadge(tags);
    return badge ? `.${badge}` : "";
}

class TestDiagnostics extends HTMLElement {

    #root;
    #running;

    constructor() {
        super();
        const root = this.attachShadow({ mode: "open" });
        render(root);
        this.#root = root;
    }

    open(callback) {
        const dialog = this.#root.querySelector("dialog");
        dialog.showModal();
        dialog.addEventListener("close", callback, { once: true });
    }

    features(spec) {
        const output = this.#root.querySelector(".output");
        output.innerHTML = "";

        for (const feature of spec) {
            output.appendChild(el(
                `SECTION.feature#_${feature.id}${statusClassSelector(feature.tags)}`,
                el("HEADING", feature.name),
                el("DIV.description", feature.description),
                el("UL.scenarios",
                    feature.scenarios.map(scenario => el(
                        `LI#_${scenario.id}`,
                        el("HEADING", scenario.name),
                        el("OL.steps",
                            scenario.steps.map(step => el(
                                `LI#_${step.id}`,
                                el("SPAN.description", `${step.keyword.trim()} ${step.text}`),
                                el("DIV.outcome")
                            ))
                        )
                    ))
                )
            ));
        }
    }

    stopped() {
        this.#running = null;
    }

    running() {
        if (this.#running) {
            this.failed("Interrupted before complete");
        }
        this.#running = Array.from(arguments).map(x => this.#root.querySelector(`#_${x}`));
        const [feature, scenario, step] = this.#running;
        if (!feature) throw new Error("Feature not found");
        if (!scenario) throw new Error("Scenario not found");
        if (!step) throw new Error("Step not found");
        step.querySelector(".outcome").innerHTML = "";
    }

    succeeded() {
        if (this.#running) {
            const [feature, scenario, step] = this.#running;
            step.classList.add("succeeded");
            setDependentStatuses(feature, scenario, step);
            this.stopped();
        } else {
            console.warn("Nothing is running");
        }
    }

    failed(err) {
        if (this.#running) {
            const [feature, scenario, step] = this.#running;
            step.classList.add("failed");
            setDependentStatuses(feature, scenario, step);
            step.querySelector(".outcome").innerHTML = ansispan(err);
            this.stopped();
        }
        console.error(err);
    }
}

customElements.define("test-diagnostics", TestDiagnostics);