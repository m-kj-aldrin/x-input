import { findMatchingSibling, getActiveElement } from "../utils/dom.js";
import { stringBoolean } from "../utils/string.js";
import { InputBaseElement } from "./base.js";

/**
 * @this {HTMLElement}
 * @param {MouseEvent} e
 */
export function clickOutside(e) {
    let composedPath = e.composedPath();
    let isInsideThis = composedPath.includes(this);

    if (!isInsideThis) {
        this.dispatchEvent(new CustomEvent("click-outside"));
    }
}

const customSelectTemplate = document.createElement("template");
customSelectTemplate.innerHTML = `
<style>
    :host{
        display: inline-block;
        user-select: none;
        -webkit-user-select: none;
        max-width: max-content;
        position: relative;


        --padding: 2px;
        --gap: 4px;
    }
    :host([label])::before{
        margin-bottom: 4px;
        display: block;
        content: attr(label);
        white-space: nowrap;
    }
    :host([open]) #list{
        opacity: 1;
        pointer-events: unset;
    }
    #selected{
        cursor: pointer;
        padding: var(--padding,4px);
        border: 1px currentColor solid;
        border-bottom-width: 2px;
        max-width: max-content;
    }
    #selected:focus{
        outline: none;
        border-bottom-color: red;
    }
    #selected[static-label]::after {
        content: attr(static-label);
        white-space: nowrap;
    }
    
    #list{
        z-index: 100;
        padding: var(--padding,4px);
        margin-top: 2px;

        background-color: #fff;
        position: absolute;

        opacity: 0;
        pointer-events: none;
        display:flex;
        flex-direction: column;
        gap: var(--gap,4px);
        border: 1px currentColor solid;
    } 
    :host([grid]) #list{
        display: grid;
        grid-template-columns: repeat(3,1fr);
    }
    ::slotted([selected]){
        filter: invert(1);
    }
</style>
<div id="selected" tabindex="0"></div>
<div id="list" part="test">
    <slot></slot>
</div>
`;

export class CustomSelectElement extends InputBaseElement {
    #value = "";
    #clickOutsideController = new AbortController();

    constructor() {
        super();

        this.shadowRoot.append(customSelectTemplate.content.cloneNode(true));

        this.#attachListeners();

        // this.value = this.getAttribute("value");
        let staticLabelAttr = this.getAttribute("static-label");
        let gridAttr = this.getAttribute("grid");
        this.setOption({
            grid: stringBoolean(gridAttr),
            staticLabel: stringBoolean(staticLabelAttr),
        });
    }

    #grid = false;
    #staticLabel = false;

    setOption({ grid = this.#grid, staticLabel = this.#staticLabel }) {
        this.toggleAttribute("grid", grid);

        if (staticLabel) {
            this.shadowRoot
                .querySelector("#selected")
                .setAttribute("static-label", this.name);
        } else {
            this.shadowRoot
                .querySelector("#selected")
                .removeAttribute("static-label");
        }
    }

    #attachListeners() {
        this.addEventListener("select", this.#selectHandler.bind(this));

        this.shadowRoot
            .getElementById("selected")
            .addEventListener("click", (e) => {
                this.open();
            });

        this.shadowRoot
            .getElementById("selected")
            .addEventListener("keydown", (e) => {
                if (e.key == "Enter" || e.key == " ") {
                    this.open();
                }
            });

        this.shadowRoot.addEventListener("slotchange", (e) => {
            // /**@type {HTMLSlotElement} */
            // let slot = e.target;

            // let host = this.getRootNode().host;
            // if (host instanceof CustomInputElement && slot.id != "input-slot")
            //     return;

            //   let options = [...this.querySelectorAll("x-option")];

            // /**@type {CustomOptionElement[]} */
            // let options = slot
            //     .assignedElements()
            //     .filter((el) => el instanceof CustomOptionElement);
            let options = [...this.querySelectorAll("x-option")];

            let minLength = options.reduce((prev, curr) => {
                let box = curr.getBoundingClientRect();
                return Math.max(prev, box.width);
            }, 0);

            this.shadowRoot.getElementById(
                "selected"
            ).style.minWidth = `${minLength}px`;

            let noSelected = options.every(
                (option) => !option.hasAttribute("selected")
            );

            if (
                noSelected &&
                !this.shadowRoot
                    .querySelector("#selected")
                    .getAttribute("static-label")
            ) {
                options.at(0)?.select(true);
            }
        });

        this.addEventListener("click-outside", (e) => {
            this.open(false);
        });

        this.addEventListener("focusout", (e) => {
            if (
                e.relatedTarget instanceof CustomOptionElement ||
                e.relatedTarget instanceof CustomSelectElement
            )
                return;

            this.open(false);
        });
    }

    /**@param {boolean} [force] */
    open(force) {
        this.toggleAttribute("open", force);
        if (this.hasAttribute("open")) {
            this.#attachClickOutside();
            this.#toggleTabIndex(true);
        } else {
            this.#attachClickOutside(true);
            this.#toggleTabIndex(false);
        }
    }

    /**@param {boolean} state */
    #toggleTabIndex(state) {
        // let optionElements = this.#getAssignedOptions();
        let optionElements = [...this.querySelectorAll("x-option")];
        if (state) {
            optionElements
                .filter((el) => !el.hasAttribute("selected"))
                .forEach((option) => {
                    option.tabIndex = 0;
                });
        } else {
            optionElements.forEach((option) => {
                option.removeAttribute("tabIndex");
            });
        }
    }

    // /**@returns {CustomOptionElement[]} */
    // #getAssignedOptions() {
    //     /**@type {HTMLSlotElement} */
    //     let slot = this.shadowRoot.querySelector("#list slot");
    //     let assignedElements = slot.assignedElements();
    //     if (assignedElements.at(0) instanceof HTMLSlotElement) {
    //         assignedElements = assignedElements.at(0).assignedElements();
    //     }
    //     return assignedElements.filter(
    //         (el) => el instanceof CustomOptionElement
    //     );
    // }

    /**@param {SelectEvent} e*/
    #selectHandler(e) {
        if (!(e.target instanceof CustomOptionElement)) return;
        e.stopPropagation();

        this.shadowRoot.querySelector("x-option")?.remove();

        /**@type {CustomOptionElement} */ //@ts-ignore
        let optionClone = e.target.cloneNode(true);
        optionClone.removeAttribute("tabindex");

        e.target.toggleAttribute("selected", true);

        // this.#getAssignedOptions();

        // this.#getAssignedOptions().forEach((option) => {
        //     if (option != e.target) {
        //         option.removeAttribute("selected");
        //     }
        // });
        this.querySelectorAll("x-option").forEach((option) => {
            if (option != e.target) {
                option.removeAttribute("selected");
            }
        });

        if (
            !this.shadowRoot
                .querySelector("#selected")
                .hasAttribute("static-label")
        ) {
            this.shadowRoot.getElementById("selected").textContent = "";
            this.shadowRoot.getElementById("selected").append(optionClone);
        }

        this.#value = optionClone.value;

        if (!e.silent) {
            this.open(false);
            this.dispatchEvent(
                new InputEvent("input", { bubbles: true, composed: true })
            );
        }
    }

    get value() {
        return this.#value;
    }
    set value(value) {
        this.#value = value;
        this.querySelectorAll("x-option").forEach((option) => {
            if (option.value == `${value}`) {
                option.dispatchEvent(new SelectEvent(true));
            }
        });
        // this.#getAssignedOptions().forEach((option, i) => {
        //     if (option.value == `${value}`) {
        //         option.dispatchEvent(new SelectEvent(true));
        //     }
        // });
    }
    get normalValue() {
        return this.#value;
    }
    set normalValue(normalValue) {}

    #attachClickOutside(remove = false) {
        this.#clickOutsideController.abort();
        if (!remove) {
            this.#clickOutsideController = new AbortController();

            window.addEventListener("pointerdown", clickOutside.bind(this), {
                signal: this.#clickOutsideController.signal,
            });
        }
    }
    connectedCallback() {
        this.value = this.#value;
    }

    disconnectedCallback() {
        this.#attachClickOutside(true);
    }
}

export class SelectEvent extends CustomEvent {
    #silent = false;

    /**
     * @param {boolean} [silent]
     */
    constructor(silent) {
        super("select", { bubbles: true });
        this.#silent = silent;
    }

    get silent() {
        return this.#silent;
    }

    get detail() {
        return super.detail;
    }

    /**@type {HTMLElement} */
    get target() {
        return super.target;
    }
}

const customOptionTemplate = document.createElement("template");
customOptionTemplate.innerHTML = `
<style>
    :host{
        display: block;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
        width: 100%;

        background-color: #fff;

        white-space: nowrap;
    }
    :host(:focus){
        outline: none;
    }
    :host(:focus) *{
        color: red;
    }
</style>
<slot></slot>
`;

export class CustomOptionElement extends HTMLElement {
    #value = "";
    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        this.shadowRoot.append(customOptionTemplate.content.cloneNode(true));

        let valueAttr = this.getAttribute("value");

        this.#value = valueAttr || this.textContent;

        if (this.hasAttribute("selected")) {
            this.select(true);
        }

        this.#attachListeners();
    }

    #attachListeners() {
        this.addEventListener("click", this.#clickHandler.bind(this));
        this.addEventListener("keydown", (e) => {
            if (this.hasAttribute("selected")) return;
            if (e.key == "Enter" || e.key == " ") {
                this.select();
            }
        });
    }

    /**@param {MouseEvent} e */
    #clickHandler(e) {
        if (this.hasAttribute("selected")) return;
        if (this.hasAttribute("noselect")) return;
        this.select();
    }

    /**@param {SelectEvent['silent']} [silent] */
    select(silent) {
        this.dispatchEvent(new SelectEvent(silent));
    }

    get value() {
        return this.#value;
    }

    connectedCallback() {}
    disconnectedCallback() {}
}
