import { InputBaseElement } from "./base.js";

const buttonBaseTemplate = document.createElement("template");
buttonBaseTemplate.innerHTML = `
<style>
    :host{
        box-sizing: border-box;

        cursor: pointer;
        border: 1px currentColor solid;
        border-bottom-width: 2px;

        background-color: #fff;
        display: inline-block;

        user-select: none;
        -webkit-user-select: none;

        white-space: nowrap;

    }
    :host(:empty)::before{
    }
    :host(:not([square])){
        padding: 2px 2px;
    }
    :host([square]){
        width: 2ch;
        aspect-ratio: 1/1;
        text-align: center;
    }
    :host(:focus-within){
        border-bottom-color: red;
    }
    :host([keydown]) #inner{
        color: red;
        transition-delay: 0ms;
    }
    #inner{
        color: black;
        user-select: none;
        transition: 75ms ease color;
    }
    #inner:active{
        color: red;
        transition-delay: 0ms;
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
    #pointerState = false;

    constructor() {
        super();

        this.shadowRoot.append(buttonBaseTemplate.content.cloneNode(true));

        this.#attachListeners();
    }

    setOption({ square = false }) {
        this.toggleAttribute("square", square);
    }

    /**@param {KeyboardEvent} e */
    #handleKeyPress(e) {
        if (this.validKeys(e)) {
            if (e.type == "keydown") {
                this.toggleAttribute("keydown", true);
            }
            if (e.type == "keyup") {
                this.emitInput();
                this.removeAttribute("keydown");
            }
        }
    }

    /**@param {PointerEvent} e */
    #handlePointer(e) {
        if (e.type == "pointerdown") {
            this.#pointerState = true;
        } else if (e.type == "pointerup") {
            if (this.#pointerState) {
                this.emitInput();
            }
            this.#pointerState = false;
        }
    }

    #attachListeners() {
        this.addEventListener("keydown", this.#handleKeyPress.bind(this));
        this.addEventListener("keyup", this.#handleKeyPress.bind(this));
        this.addEventListener("pointerdown", this.#handlePointer.bind(this));
        this.addEventListener("pointerup", this.#handlePointer.bind(this));
        this.addEventListener("focusout", (e) => {
            this.removeAttribute("keydown");
        });
    }

    connectedCallback() {}
    disconnectedCallback() {}
}

const customMomentaryTemplate = document.createElement("template");
customMomentaryTemplate.innerHTML = `
<style>
</style>
`;

export class CustomMomentaryElement extends ButtonBaseElement {
    constructor() {
        super();

        this.shadowRoot.append(customMomentaryTemplate.content.cloneNode(true));
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
