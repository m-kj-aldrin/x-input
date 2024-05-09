import { InputBaseElement } from "../src/custom-elements/base.js";
import "../src/custom-elements/index.js";

document.body.addEventListener("input", (e) => {
    if (e.target instanceof InputBaseElement) {
        console.log(`name: ${e.target.name}
label: ${e.target.label}
value: ${e.target.value}
normal value: ${e.target.normalValue}`);
    }
});

const buttonMomentary = document.createElement("x-momentary");
buttonMomentary.name = "pulse";

const buttonToggle = document.createElement("x-toggle");
buttonToggle.name = "toggle";

document.body.append(buttonMomentary, buttonToggle);

const range0 = document.createElement("x-range");
range0.label = "frq";
range0.setOption({
    max: 2000,
    value: 20,
    showOutput: true,
});

const range1 = document.createElement("x-range");
range1.label = "amp";
range1.setOption({
    max: 1,
    step: 0.01,
    value: 0.5,
    showOutput: true,
});

document.body.append(range0, range1);

const select0 = document.createElement("x-select");
select0.name = "wave select";
select0.label = "select a waveform";
select0.innerHTML = `
<x-option>sine</x-option>
<x-option>square</x-option>
<x-option>ramp up</x-option>
<x-option>ramp down</x-option>
`;

const select1 = document.createElement("x-select");
select1.name = "insert module";
select1.setOption({ staticLabel: true, grid: true });
select1.innerHTML = `
<x-option>pth</x-option>
<x-option>lfo</x-option>
<x-option>cha</x-option>
`;

document.body.append(select0, select1);
