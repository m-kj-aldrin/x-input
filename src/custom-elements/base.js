const inputBaseTemplate = document.createElement("template");
inputBaseTemplate.innerHTML = `
<style>
    :host{
        width: min-content;
    }
</style>
`;

export class InputBaseElement extends HTMLElement {
    constructor(delegatesFocus = true) {
        super();

        this.attachShadow({ mode: "open", delegatesFocus });

        this.shadowRoot.append(inputBaseTemplate.content.cloneNode(true));

        let nameAttr = this.getAttribute("name");
        this.name = nameAttr;

        let labelAttr = this.getAttribute("label");
        this.label = labelAttr;
    }

    emitInput() {
        this.dispatchEvent(
            new InputEvent("input", { bubbles: true, composed: true })
        );
    }

    /**@param {KeyboardEvent} e */
    validKeys(e, pattern = " |Enter") {
        if (new RegExp(pattern).test(e.key)) {
            return true;
        }
        return false;
    }

    #label = "";
    get label() {
        return this.#label || this.#name;
    }
    set label(label) {
        this.setAttribute("label", label);
        this.#label = label;
    }

    #name = "";
    get name() {
        return this.#name || this.#label;
    }
    set name(name) {
        this.setAttribute("name", name);
        this.#name = name;
    }

    get value() {
        return 0;
    }
    set value(value) {}

    get normalValue() {
        return 0;
    }
    set normalValue(normalValue) {}

    setOption(opt) {}

    connectedCallback() {}
    disconnectedCallback() {}
}
