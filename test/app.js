import "../src/custom-elements/index.js";
import { CustomInputElement } from "../src/custom-elements/x-input.js";

document.body.addEventListener("input", (e) => {
    if (e.target instanceof CustomInputElement) {
        console.log(e.target.label, +e.target.value);
    }
});

const input0 = document.createElement("x-input").setType("momentary");
input0.label = "cycle reset";
input0.setOption({ noLabel: true });
input0.textContent = "cycle reset";

const input1 = document.createElement("x-input").setType("toggle");
input1.label = "hold";
input1.setOption({ noLabel: true });
input1.value = 1;
input1.textContent = "hold";

document.body.append(input0, input1);

const input2 = document.createElement("x-input").setType("select");
input2.label = "wave select";
input2.innerHTML = `
<x-option value="0">square</x-option>
<x-option value="1">sine</x-option>
<x-option value="2">ramp up</x-option>
<x-option value="3">ramp down</x-option>
`;

document.body.append(input2);

const input3 = document.createElement("x-input").setType("range");
input3.label = "frq";
input3.setOption({
    value: 20,
    max: 2000,
    showOutput: true,
});

const input4 = document.createElement("x-input").setType("range");
input4.label = "amp";
input4.setOption({
    max: 1,
    normalValue: 0.5,
    step: 0.01,
    showOutput: true,
});

document.body.append(input3, input4);

const input5 = document.createElement("x-input").setType("number");
input5.label = "free";
input5.value = -128;

document.body.append(input5);
