// const inputBaseTemplate = document.createElement("template");
// inputBaseTemplate.innerHTML = `

// `;

// export class InputBaseElement extends HTMLElement {
//     constructor(delegatesFocus = false) {
//         super();

//         this.attachShadow({ mode: "open", delegatesFocus });

//         this.shadowRoot.append(inputBaseTemplate.content.cloneNode(true));
//     }

//     emitInput() {
//         this.dispatchEvent(
//             new InputEvent("input", { bubbles: true, composed: true })
//         );
//     }

//     get value() {
//         return 0;
//     }
//     set value(value) {}

//     setOption(opt) {}

//     connectedCallback() {}
//     disconnectedCallback() {}
// }

// const customMomentaryTemplate = document.createElement("template");
// customMomentaryTemplate.innerHTML = `
// <style>
//     :host {
//         background-color: #fff;
//         display: inline-block;
//         border: 1px currentColor solid;
//         padding: 2px 4px;
//     }
//     :host(:focus-within){
//         outline: 1px red solid;
//         outline-offset: 2px;
//     }
//     #inner{
//         user-select: none;
//     }
//     #inner:focus {
//         outline: none;
//     }
//     #inner:active{
//         color: red;
//     }
// </style>
// <div id="inner" tabindex="0">
//     <slot></slot>
// </div>
// `;

// export class CustomMomentaryElement extends InputBaseElement {
//     #keyPressState = false;

//     constructor() {
//         super(true);

//         this.shadowRoot.append(customMomentaryTemplate.content.cloneNode(true));

//         this.#attachListeners();
//     }

//     setOption({ one = 1 }) {}

//     get value() {
//         return 1;
//     }

//     set value(value) {}

//     get normalValue() {
//         return 1;
//     }

//     /**@param {KeyboardEvent} e */
//     #validKeys(e, pattern = " |Enter") {
//         if (new RegExp(pattern).test(e.key)) {
//             return true;
//         }
//         return false;
//     }

//     /**@param {KeyboardEvent} e */
//     #handleKeyPress(e) {
//         if (this.#validKeys(e)) {
//             if (e.type == "keydown" && !this.#keyPressState) {
//                 this.#keyPressState = true;
//                 this.emitInput();
//             }
//             if (e.type == "keyup") {
//                 this.#keyPressState = false;
//             }
//         }
//     }

//     #attachListeners() {
//         this.addEventListener("keydown", this.#handleKeyPress.bind(this));
//         this.addEventListener("keyup", this.#handleKeyPress.bind(this));
//         this.addEventListener("pointerdown", this.emitInput.bind(this));
//     }
// }

// customElements.define("x-momentary", CustomMomentaryElement);

// const customToggleTemplate = document.createElement("template");
// customToggleTemplate.innerHTML = `
// <style>
//     :host {
//         background-color: #fff;
//         display: inline-block;
//         border: 1px currentColor solid;
//         padding: 2px 4px;
//     }
//     :host(:focus-within){
//         outline: 1px red solid;
//         outline-offset: 2px;
//     }
//     :host([data-state="on"]){
//         color: red;
//     }
//     #inner{
//         user-select: none;
//     }
//     #inner:focus {
//         outline: none;
//     }
// </style>
// <div id="inner" tabindex="0">
//     <slot></slot>
// </div>
// `;

// export class CustomToggleElement extends InputBaseElement {
//     constructor() {
//         super(true);

//         this.shadowRoot.append(customToggleTemplate.content.cloneNode(true));

//         this.#attachListeners();
//     }

//     setOption({ bla = "ok", yes = false }) {}

//     /**@returns {"on" | "off"} */
//     #getStateAttribute() {
//         return this.getAttribute("data-state");
//     }
//     /**@param {"on" | "off"} state */
//     #setStateAttribute(state) {
//         this.setAttribute("data-state", state);
//     }

//     get value() {
//         let stateAttr = this.#getStateAttribute();
//         let state = stateAttr == "on" ? true : false;
//         return +state;
//     }

//     set value(value) {
//         let invertState = value == 1 ? "on" : "off";
//         this.#setStateAttribute(invertState);
//     }

//     #attachListeners() {
//         this.addEventListener("pointerdown", this.toggle.bind(this));
//         this.addEventListener(
//             "keydown",
//             (e) => (e.key == " " || e.key == "Enter") && this.toggle.call(this)
//         );
//     }

//     toggle() {
//         let stateAttr = this.#getStateAttribute();
//         let state = stateAttr == "on" ? true : false;
//         let invertState = state ? "off" : "on";
//         this.#setStateAttribute(invertState);

//         this.emitInput();
//     }

//     connectedCallback() {}
//     disconnectedCallback() {}
// }

// customElements.define("x-toggle", CustomToggleElement);

// /**
//  * @typedef {object} InputTypeNameMap
//  * @prop {CustomMomentaryElement} momentary
//  * @prop {CustomToggleElement} toggle
//  */

// /**@typedef {keyof InputTypeNameMap} InputTypeNames */
// /**@typedef {InputTypeNameMap[InputTypeNames]} InputTypes */

// const customInputTemplate = document.createElement("template");
// customInputTemplate.innerHTML = `
// <div id="input-container">
// </div>
// `;

// /**@type {import("./types.js").UnionToTuple<InputTypeNames>} */
// const TYPE_ARR = ["momentary", "toggle"];

// export class CustomInputElement extends InputBaseElement {
//     /**@type {InputTypes} */
//     #inputElement;

//     constructor() {
//         super();

//         this.shadowRoot.append(customInputTemplate.content.cloneNode(true));

//         let typeAttr = this.getAttribute("type");

//         this.setType(typeAttr);
//     }

//     get value() {
//         return this.#inputElement.value;
//     }
//     set value(value) {
//         this.#inputElement.value = value;
//     }

//     setOption(opt) {
//         this.#inputElement.setOption(opt);
//     }

//     /**@param {InputTypeNames} typeString */
//     #checkValidType(typeString) {
//         if (TYPE_ARR.some((s) => s == typeString)) {
//             return typeString;
//         }
//         return false;
//     }

//     /**
//      * @template {InputTypeNames} T
//      * @param {T} type
//      * @returns {import("./types.js").TypedCustomInputElement<InputTypeNameMap[T]>}
//      */
//     setType(type) {
//         if (!this.#checkValidType(type)) return;

//         let inputContainer = this.shadowRoot.querySelector("#input-container");
//         inputContainer.querySelector("#input")?.remove();

//         let inputElement = document.createElement(`x-${type}`);
//         const inputSlot = document.createElement("slot");

//         inputElement.append(inputSlot);
//         inputContainer.append(inputElement);

//         this.#inputElement = inputElement;
//         return this;
//     }
// }

// customElements.define("x-input", CustomInputElement);
