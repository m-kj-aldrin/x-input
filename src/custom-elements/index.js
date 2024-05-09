import { CustomMomentaryElement, CustomToggleElement } from "./x-button.js";
import { CustomNumberElement } from "./x-number.js";
import { CustomRangeElement } from "./x-range.js";
import { CustomOptionElement, CustomSelectElement } from "./x-select.js";

customElements.define("x-momentary", CustomMomentaryElement);
customElements.define("x-toggle", CustomToggleElement);

customElements.define("x-select", CustomSelectElement);
customElements.define("x-option", CustomOptionElement);

customElements.define("x-range", CustomRangeElement);

customElements.define("x-number", CustomNumberElement);
