import el from "./el.js";

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
    this.dialog = el("DIALOG.diagnostics",
        el("div.container",
            el("header",
                monitorIcon.cloneNode(true),
                el("h2", "Dashboard")
            ),
            el("div.output")
        )
    )
    root.appendChild(this.dialog);
}

class TestDiagnostics extends HTMLElement {

    #root;

    constructor() {
        super();
        this.#root = this.attachShadow({ mode: "open" });
        this.render = render.bind({}, this.#root);
        this.render();
    }

    open(callback) {
        const dialog = this.#root.querySelector("dialog");
        dialog.showModal();
        dialog.addEventListener("close", callback, { once: true });
    }
}

customElements.define("test-diagnostics", TestDiagnostics);