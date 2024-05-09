import { InputBaseElement } from "./base.js";
import { CustomMomentaryElement, CustomToggleElement } from "./x-button.js";
import { CustomNumberElement } from "./x-number.js";
import { CustomRangeElement } from "./x-range.js";
import { CustomSelectElement } from "./x-select.js";
import { parseKeyValuePairs } from "../utils/string.js";

/**
 * @typedef {object} InputTypeNameMap
 * @prop {CustomMomentaryElement} momentary
 * @prop {CustomToggleElement} toggle
 * @prop {CustomSelectElement} select
 * @prop {CustomRangeElement} range
 * @prop {CustomNumberElement} number
 */

/**@typedef {keyof InputTypeNameMap} InputTypeNames */
/**@typedef {InputTypeNameMap[InputTypeNames]} InputTypes */
/**@typedef {import("../types.js").UnionToTuple<InputTypeNames>} TYPE_ARR */

const customInputTemplate = document.createElement("template");
customInputTemplate.innerHTML = `
<style>
    :host(:not([nolabel]))::before{
        content: attr(label);
    }
</style>
<div id="input-container">
</div>
`;

/**@type {TYPE_ARR} */
const TYPE_ARR = ["momentary", "toggle", "select", "range", "number"];

export class CustomInputElement extends InputBaseElement {
    /**@type {InputTypeNames} */
    #type;

    #label = "";

    static get observedAttributes() {
        return ["type"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "type" && newValue != this.#type) {
            this.setAttribute("type", this.#type);
        }
    }

    /**@type {InputTypes} */
    #inputElement;

    constructor() {
        super();

        this.shadowRoot.append(customInputTemplate.content.cloneNode(true));

        let typeAttr = this.getAttribute("type");
        let valueAttr = this.getAttribute("value");

        this.setType(typeAttr);

        this.value = valueAttr;

        this.#getOptionAttr();
        this.#getMiscAttr();
    }

    #getMiscAttr() {
        let labelAttr = this.getAttribute("label");
        this.label = labelAttr;
    }

    #getOptionAttr() {
        let optionAttr = this.getAttribute("option");
        if (!(typeof optionAttr == "string")) return;
        let options = parseKeyValuePairs(optionAttr);

        this.setOption(options);
    }

    get inputElement() {
        return this.#inputElement;
    }

    set label(label) {
        if (!(typeof label == "string")) return;
        this.setAttribute("label", label);
    }
    get label() {
        return this.getAttribute("label");
    }

    get value() {
        return this.#inputElement.value;
    }
    set value(value) {
        // console.log("input set value", value);
        this.#inputElement.value = value;
    }
    get normalValue() {
        return this.#inputElement.normalValue;
    }
    set normalValue(normalValue) {
        this.#inputElement.normalValue = normalValue;
    }

    /**
     *
     * @param {object} opt
     * @param {boolean} [opt.noLabel]
     */
    setOption(opt) {
        if (opt.noLabel) {
            this.toggleAttribute("nolabel", true);
        }
        this.#inputElement.setOption(opt);
    }

    /**@param {InputTypeNames} typeString */
    #checkValidType(typeString) {
        if (TYPE_ARR.some((s) => s == typeString)) {
            return typeString;
        }
        return false;
    }

    /**
     * @template {InputTypeNames} T
     * @param {T} type
     * @returns {import("../types.js").TypedCustomInputElement<InputTypeNameMap[T]>}
     */
    setType(type) {
        if (!this.#checkValidType(type)) return;

        this.#type = type;

        const inputContainer =
            this.shadowRoot.querySelector("#input-container");
        inputContainer.querySelector("#input")?.remove();

        const inputElement = document.createElement(`x-${type}`);

        const inputSlot = document.createElement("slot");
        inputSlot.id = "input-slot";

        inputElement.append(inputSlot);
        inputContainer.append(inputElement);

        this.setAttribute("type", type);

        this.#inputElement = inputElement;
        return this;
    }
}
