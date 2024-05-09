import { clamp, mapRange, quantize } from "../utils/math.js";
import { stringBoolean } from "../utils/string.js";
import { InputBaseElement } from "./base.js";

const customRangeTemplate = document.createElement("template");
customRangeTemplate.innerHTML = `
<style>
    :host{
        display: block;
        cursor: ew-resize;
        overflow: visible;
    }
    :host([label])::before{
        margin-bottom: 4px;
        display: block;
        content: attr(label);
        white-space: nowrap;
    }
    #inner:focus{
        outline: none;
    }
    #inner:focus #marker{
        fill: red;
    }
    #output{
        user-select: none;
        -webkit-user-select: none;

        display: none;
    }
    #output[data-show]{
        display: unset; 
    }
    #inner{
        padding: 4px;
        padding-bottom: 6px;
    }
    svg{
        display: block;
        overflow: visible;
    }
</style>
<div id="inner" tabindex="0">
    <svg width="150" height="16">
        <rect width="calc(100% + 5px)" x="-2.5" height="2" y="7"></rect>
        <g id="marker-group" transform="translate(0 0)">
            <rect id="marker" width="5" height="7" x="-2.5" y="0"></rect>
            <g id="output">
                <rect id="backdrop" width="0" y="0" text-ancor="" height="0" fill="white"></rect>
                <text font-size="10" x="0" y="20" text-anchor="middle">hello</text>
            </g>
        </g>
    </svg>
</div>
`;

export class CustomRangeElement extends InputBaseElement {
    #value = 0;
    #normalValue = 0;

    #min = 0;
    #max = 100;
    #step = 1;
    #normalStep = this.#min / this.#max;

    constructor() {
        super();

        this.shadowRoot.append(customRangeTemplate.content.cloneNode(true));

        let options = this.getOptionsAttribute();
        this.setOption(options);

        this.#attachListeners();
    }

    get type() {
        return "range";
    }

    getOptionsAttribute() {
        let minAttr = this.getAttribute("min") ?? 0;
        let maxAttr = this.getAttribute("max") ?? 100;
        let stepAttr = this.getAttribute("step") ?? 1;
        let valueAttr = this.getAttribute("value") ?? 0;
        let normalValueAttr = this.getAttribute("normalValue");
        let showOutputAttr = stringBoolean(this.getAttribute("showOutput"));

        return {
            min: +minAttr,
            max: +maxAttr,
            step: +stepAttr,
            value: +valueAttr,
            normalValue:
                normalValueAttr != undefined ? +normalValueAttr : undefined,
            showOutput: showOutputAttr,
        };
    }

    #showOutput = false;

    /**
     * @param {object} options
     * @param {number} [options.min]
     * @param {number} [options.max]
     * @param {number} [options.step]
     * @param {number} [options.value]
     * @param {number} [options.normalValue]
     * @param {boolean} [options.showOutput]
     */
    setOption({
        min = this.#min,
        max = this.#max,
        step = this.#step,
        value = this.#value,
        normalValue = undefined,
        showOutput = this.#showOutput,
    }) {
        this.#min = min;
        this.#max = max;
        this.#step = step;
        this.#normalStep = this.#step / (this.#max - this.#min);
        this.#showOutput = showOutput;

        if (normalValue != undefined) {
            this.normalValue = normalValue;
        } else {
            this.value = value;
        }

        this.shadowRoot
            .querySelector("#output")
            .toggleAttribute("data-show", showOutput);
    }

    get value() {
        return this.#value;
    }
    set value(value) {
        value = clamp(value, this.#min, this.#max);
        this.#value = quantize(value, this.#step);

        this.#normalValue = mapRange(this.#value, this.#min, this.#max, 0, 1);
        this.#updateSliderPosition();
    }
    get normalValue() {
        return this.#normalValue;
    }
    set normalValue(value) {
        value = clamp(value, 0, 1);
        this.#normalValue = quantize(value, this.#normalStep);

        this.#value = quantize(
            mapRange(value, 0, 1, this.#min, this.#max),
            this.#step
        );

        this.#updateSliderPosition();
    }

    #attachListeners() {
        this.addEventListener("pointerdown", this.#dragStart.bind(this));
        this.addEventListener("keydown", (e) => {
            let key = e.key;

            if (this.validKeys(e, "ArrowRight|ArrowLeft")) {
                let direction = 0;

                direction =
                    key == "ArrowRight" ? 1 : key == "ArrowLeft" ? -1 : 0;

                if (!direction) return;

                this.value = this.value + direction * this.#step;
                this.#emit();
            } else if (this.validKeys(e, "[0-9.]")) {
                // console.log("key", e.key);
                this.#keyCapture(e.key);
            }
        });
    }

    #keyCaptureCache = "";
    #captureId = null;

    /**@param {string} string */
    #keyCapture(string) {
        clearTimeout(this.#captureId);

        this.#keyCaptureCache += string;

        this.#captureId = setTimeout(() => {
            this.value = parseFloat(this.#keyCaptureCache);
            this.#keyCaptureCache = "";
            this.#captureId = null;

            this.#emit();
        }, 300);
    }

    /**@param {PointerEvent} e */
    #dragStart(e) {
        const abortController = new AbortController();
        this.setPointerCapture(e.pointerId);

        let f = this.#positionToRelativeValue.call(this, e);
        f = quantize(clamp(f), this.#normalStep);

        if (f != this.normalValue) {
            this.normalValue = f;
            this.#emit();
        }

        this.addEventListener("pointermove", this.#dragMove.bind(this), {
            signal: abortController.signal,
        });

        this.addEventListener(
            "pointerup",
            this.#dragEnd.bind(this, abortController)
        );
    }

    /**@param {PointerEvent} e */
    #dragMove(e) {
        let f = this.#positionToRelativeValue.call(this, e);
        f = quantize(clamp(f), this.#normalStep);

        if (f != this.normalValue) {
            this.normalValue = f;
            this.#emit();
        }
    }

    /**
     * @param {AbortController} abortController
     * @param {PointerEvent} e
     */
    #dragEnd(abortController, e) {
        this.releasePointerCapture(e.pointerId);
        abortController.abort();
    }

    #emit() {
        this.dispatchEvent(
            new InputEvent("input", { bubbles: true, composed: true })
        );
    }

    #getSvg() {
        return this.shadowRoot.querySelector("svg");
    }

    #updateSliderPosition() {
        let svg = this.#getSvg();
        let box = svg.getBoundingClientRect();

        let x = box.width * this.normalValue;

        this.shadowRoot
            .querySelector("#marker-group")
            .setAttribute("transform", `translate(${x})`);
        let textElement = this.shadowRoot.querySelector("#output text");
        textElement.textContent = `${this.value}`;

        let textElementBBox = textElement.getBoundingClientRect();
        this.shadowRoot
            .querySelector("#backdrop")
            .setAttribute("width", `${textElementBBox.width}`);
        this.shadowRoot
            .querySelector("#backdrop")
            .setAttribute("x", `${-textElementBBox.width / 2}`);
        this.shadowRoot
            .querySelector("#backdrop")
            .setAttribute("height", `${textElementBBox.height}`);
        this.shadowRoot
            .querySelector("#backdrop")
            .setAttribute("y", `${textElementBBox.height}`);
    }
    /**
     * @param {PointerEvent} e
     * @this {CustomRangeElement}
     */
    #positionToRelativeValue(e) {
        let box = this.#getSvg().getBoundingClientRect();
        let x = e.clientX - box.x;
        return x / box.width;
    }

    connectedCallback() {
        this.#updateSliderPosition();
    }
    disconnectedCallback() {}
}
