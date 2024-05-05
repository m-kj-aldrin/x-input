import { InputBaseElement } from "./base.js";

const buttonBaseTemplate = document.createElement("template");
buttonBaseTemplate.innerHTML = `
<style>
    :host{
        cursor: pointer;
        border: 1px currentColor solid;
        border-bottom-width: 2px;

        background-color: #fff;
        display: inline-block;
        padding: 2px 4px;

        user-select: none;
        -webkit-user-select: none;
    }
    :host(:focus-within){
        border-bottom-color: red;
    }
    #inner{
        color: black;
        user-select: none;
        transition: 75ms ease color;
        transition-delay: 25ms;
    }
    #inner:focus {
        outline: none;
    }
</style>
<div id="inner" tabindex="0">
    <slot></slot>
</div>
`;

export class ButtonBaseElement extends InputBaseElement {
    #keyPressState = false;

    constructor() {
        super();

        this.shadowRoot.append(buttonBaseTemplate.content.cloneNode(true));

        this.#attachListeners();
    }

    /**@param {KeyboardEvent} e */
    #handleKeyPress(e) {
        if (this.validKeys(e)) {
            if (e.type == "keydown" && !this.#keyPressState) {
                this.#keyPressState = true;
                this.emitInput();
            }
            if (e.type == "keyup") {
                this.#keyPressState = false;
            }
        }
    }

    #attachListeners() {
        this.addEventListener("keydown", this.#handleKeyPress.bind(this));
        this.addEventListener("keyup", this.#handleKeyPress.bind(this));
        this.addEventListener("pointerdown", this.emitInput.bind(this));
    }

    connectedCallback() {}
    disconnectedCallback() {}
}

const customMomentaryTemplate = document.createElement("template");
customMomentaryTemplate.innerHTML = `
<style>
    #inner[pulse]{
        color: red;
        transition-delay: 0ms;
    }
</style>
`;

export class CustomMomentaryElement extends ButtonBaseElement {
    constructor() {
        super();

        this.shadowRoot.append(customMomentaryTemplate.content.cloneNode(true));

        this.#attachListeners();
    }

    async #pulse() {
        let pulseElement = this.shadowRoot.querySelector("#inner");
        pulseElement.toggleAttribute("pulse", true);
        pulseElement.addEventListener(
            "transitionend",
            (e) => {
                pulseElement.removeAttribute("pulse");
            },
            { once: true }
        );
    }

    #attachListeners() {
        this.addEventListener("input", this.#pulse.bind(this));
    }

    setOption({}) {}

    get value() {
        return 0;
    }

    set value(value) {}

    get normalValue() {
        return 0;
    }
}

const customToggleTemplate = document.createElement("template");
customToggleTemplate.innerHTML = `
<style>
    :host([data-state='on']) #inner{
        color: red;
    }
</style>
`;

export class CustomToggleElement extends ButtonBaseElement {
    constructor() {
        super();

        this.shadowRoot.append(customToggleTemplate.content.cloneNode(true));

        this.#attachListeners();
    }

    setOption({}) {}

    /**@returns {"on" | "off"} */
    #getStateAttribute() {
        return this.getAttribute("data-state");
    }
    /**@param {"on" | "off"} state */
    #setStateAttribute(state) {
        this.setAttribute("data-state", state);
    }

    get value() {
        let stateAttr = this.#getStateAttribute();
        let state = stateAttr == "on" ? true : false;
        return +state;
    }

    set value(value) {
        let invertState = value == 1 ? "on" : "off";
        this.#setStateAttribute(invertState);
    }

    get normalValue() {
        return this.value;
    }
    set normalValue(normalValue) {}

    #attachListeners() {
        this.addEventListener("input", this.toggle.bind(this));
    }

    toggle() {
        let stateAttr = this.#getStateAttribute();
        let state = stateAttr == "on" ? true : false;
        let invertState = state ? "off" : "on";
        this.#setStateAttribute(invertState);
    }

    connectedCallback() {}
    disconnectedCallback() {}
}
