const inputBaseTemplate = document.createElement("template");
inputBaseTemplate.innerHTML = `

`;

export class InputBaseElement extends HTMLElement {
    constructor(delegatesFocus = true) {
        super();

        this.attachShadow({ mode: "open", delegatesFocus });

        this.shadowRoot.append(inputBaseTemplate.content.cloneNode(true));
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
