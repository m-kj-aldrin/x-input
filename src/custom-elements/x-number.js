import { setCaretAtEnd } from "../utils/dom.js";
import { InputBaseElement } from "./base.js";

const customNumbertemplate = document.createElement("template");
customNumbertemplate.innerHTML = `
<style>
  :host{
    max-width: max-content;
  }
  [contenteditable="true"]{
    border-bottom: 2px currentColor solid;
    min-width: 2ch;
    width: max-content;
  }
  [contenteditable="true"]:focus{
    outline: none;
    border-bottom-color: red;
  }
  ::slotted([slot="label"]){
    margin-bottom: 2px;
  }
</style>
<slot name="label"></slot>
<div contenteditable="true"></div>
`;

export class CustomNumberElement extends InputBaseElement {
    #value = 0;

    constructor() {
        super();

        this.shadowRoot.append(customNumbertemplate.content.cloneNode(true));

        this.#attachListeners();
    }

    setOption({
        min = Number.NEGATIVE_INFINITY,
        max = Number.POSITIVE_INFINITY,
    }) {}

    get type() {
        return "number";
    }

    get value() {
        return this.#value;
    }

    set value(value) {
        this.#value = value;
        this.#updateEditElement();
    }

    get normalValue() {
        return this.#value;
    }
    set normalValue(normalValue) {
        this.value = normalValue;
    }

    #attachListeners() {
        this.shadowRoot.addEventListener(
            "input",
            this.#handelEditInput.bind(this)
        );
        this.shadowRoot.addEventListener(
            "keydown",
            this.#handleKeyDown.bind(this)
        );
    }

    #emitInput() {
        this.dispatchEvent(
            new InputEvent("input", { bubbles: true, composed: true })
        );
    }

    #updateEditElement() {
        this.shadowRoot.querySelector(
            "[contenteditable='true']"
        ).textContent = `${this.value}`;
    }

    /**@param {KeyboardEvent} e  */
    #handleKeyDown(e) {
        let key = e.key;
        if (key == "ArrowUp" || key == "ArrowDown") {
            e.preventDefault();
            let direction = key == "ArrowUp" ? 1 : -1;
            this.value += direction;
            setCaretAtEnd(e.target);
            this.#emitInput();
        }
    }

    /**@param {InputEvent} e */
    #handelEditInput(e) {
        if (e.target.contentEditable == "true") {
            e.stopPropagation();
            let matchArray = this.#parseValue(e.target.textContent);

            if (matchArray.length) {
                this.#value = parseFloat(matchArray[0]);
                this.#emitInput();
            }
        }
    }

    /**@param {string} inputString */
    #parseValue(inputString) {
        // Updated Regex to correctly match negative and positive integers and floats
        const regex = /-?\b\d+\b(?!\.\d*)(?!\.\b)|-?\b\d+\.\d+\b/g;
        let matches = inputString.match(regex);

        // Return the matches or an empty array if no matches found
        return matches || [];
    }
}
