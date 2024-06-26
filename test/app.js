import "../src/custom-elements/index.js";
import { CustomInputElement } from "../src/custom-elements/x-input.js";

document.body.addEventListener("input", (e) => {
    //   if (e.target instanceof CustomInputElement) {
    console.log(`label: ${e.target.label}
value: ${e.target.value}
normal value: ${e.target.normalValue}`);
    //   }
});

// const inputDelBtn = document.createElement("x-input").setType("momentary");
// inputDelBtn.setOption({ noLabel: true });
// inputDelBtn.label = "remove";
// inputDelBtn.innerHTML = "&Cross;";

// document.body.append(inputDelBtn);

// const input0 = document.createElement("x-input").setType("momentary");
// input0.label = "cycle reset";
// input0.setOption({ noLabel: true });
// input0.textContent = "cycle reset";

// const input1 = document.createElement("x-input").setType("toggle");
// input1.label = "hold";
// input1.setOption({ noLabel: true });
// input1.value = 1;
// input1.textContent = "hold";

// document.body.append(input0, input1);

// const input2 = document.createElement("x-input").setType("select");
// input2.label = "wave select";
// input2.innerHTML = `
// <x-option value="0">square</x-option>
// <x-option value="1" selected>sine</x-option>
// <x-option value="2">ramp up</x-option>
// <x-option value="3">ramp down</x-option>
// `;

// document.body.append(input2);

// const gridSelect = document.createElement("x-input").setType("select");
// gridSelect.label = "module type";
// gridSelect.setOption({ grid: true, noLabel: true });
// gridSelect.innerHTML = `
// <x-option>pth</x-option>
// <x-option>lfo</x-option>
// <x-option>bch</x-option>
// <x-option>cha</x-option>
// <x-option>seq</x-option>
// <x-option>rep</x-option>
// `;

// document.body.append(gridSelect);

// const input3 = document.createElement("x-input").setType("range");
// input3.label = "frq";
// input3.setOption({
//     value: 20,
//     max: 2000,
//     showOutput: true,
// });

// const input4 = document.createElement("x-input").setType("range");
// input4.label = "amp";
// input4.setOption({
//     max: 1,
//     normalValue: 0.5,
//     step: 0.01,
//     showOutput: true,
// });

// document.body.append(input3, input4);

// const input5 = document.createElement("x-input").setType("number");
// input5.label = "free";
// input5.value = -128;

// document.body.append(input5);

// const selectStatic = document.createElement("x-input").setType("select");
// selectStatic.innerHTML = `
// <x-option>pth</x-option>
// <x-option>lfo</x-option>
// <x-option>bch</x-option>
// <x-option>cha</x-option>
// <x-option>seq</x-option>
// <x-option>rep</x-option>
// `;

// selectStatic.label = "select module";
// selectStatic.setOption({
//   grid: true,
//   staticLabel: "select module",
//   noLabel: true,
// });

// const selectDynamic = document.createElement("x-input").setType("select");
// selectDynamic.innerHTML = `
// <x-option>pth</x-option>
// <x-option>lfo</x-option>
// <x-option>bch</x-option>
// <x-option>cha</x-option>
// <x-option>seq</x-option>
// <x-option>rep</x-option>
// `;

// selectDynamic.label = "select module";
// selectDynamic.setOption({ noLabel: true });
// document.body.append(selectStatic, selectDynamic);

// const nestedSelect = document.createElement("x-select");
// nestedSelect.setOption({ staticLabel: "menu" });
// nestedSelect.open()

// nestedSelect.innerHTML = `
// <x-option>one</x-option>
// <x-option>one</x-option>
// <x-option>one</x-option>
// <x-option>one</x-option>
// <x-option>one</x-option>
// <x-option>one</x-option>
// `

// nestedSelect.innerHTML = `
// <x-option noselect >
//     <x-select open static-label="menu" grid="true">
//         <x-option>pth</x-option>
//         <x-option>lfo</x-option>
//         <x-option>bch</x-option>
//         <x-option>cha</x-option>
//         <x-option>seq</x-option>
//         <x-option>rep</x-option>
//     </x-select>
// </x-option>
// `;

// document.body.append(nestedSelect);

const list0 = document.createElement("x-list");

list0.innerHTML = `
<x-input type="momentary" label="remove chain" option="noLabel=true">remove</x-input>
<x-input type="select" option="staticLabel=add module,grid=true,noLabel=true" label="add module">
    <x-option>pth</x-option>
    <x-option>lfo</x-option>
    <x-option>bch</x-option>
    <x-option>cha</x-option>
    <x-option>seq</x-option>
    <x-option>rep</x-option>
</x-input>
`;

document.body.append(list0);
