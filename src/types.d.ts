import {
    CustomMomentaryElement,
    CustomToggleElement,
} from "./custom-elements/x-button";
import { CustomInputElement } from "./custom-elements/x-input";
import { CustomListElement } from "./custom-elements/x-list";
import { CustomNumberElement } from "./custom-elements/x-number";
import { CustomRangeElement } from "./custom-elements/x-range";
import {
    CustomOptionElement,
    CustomSelectElement,
} from "./custom-elements/x-select";

declare global {
    interface HTMLElementTagNameMap {
        "x-input": CustomInputElement;
        "x-momentary": CustomMomentaryElement;
        "x-toggle": CustomToggleElement;
        "x-select": CustomSelectElement;
        "x-option": CustomOptionElement;
        "x-range": CustomRangeElement;
        "x-number": CustomNumberElement;
        "x-list": CustomListElement;
    }

    interface HTMLTagNameAttributeSelectorMap {
        "x-input[type='momentary']": TypedCustomInputElement<CustomMomentaryElement>;
        "x-input[type='toggle']": TypedCustomInputElement<CustomToggleElement>;
        "x-input[type='select']": TypedCustomInputElement<CustomSelectElement>;
        "x-input[type='range']": TypedCustomInputElement<CustomRangeElement>;
        "x-input[type='number']": TypedCustomInputElement<CustomRangeElement>;
    }

    interface MouseEvent {
        target: HTMLElement;
    }

    interface PointerEvent {
        target: HTMLElement;
    }

    interface KeyboardEvent {
        target: HTMLElement;
    }

    interface InputEvent {
        target: HTMLElement;
    }

    interface ParentNode {
        querySelector<K extends keyof HTMLTagNameAttributeSelectorMap>(
            selectors: K
        ): HTMLTagNameAttributeSelectorMap[K] | null;
    }

    interface ShadowRoot {
        addEventListener<K extends keyof HTMLElementEventMap>(
            type: K,
            listener: (this: ShadowRoot, ev: HTMLElementEventMap[K]) => any,
            options?: boolean | AddEventListenerOptions
        ): void;
    }
}

interface TypedCustomInputElement<T extends InputTypes>
    extends CustomInputElement {
    setOption: T["setOption"] | CustomInputElement["setOption"];
    inputElement: T;
}

// Utility type to transform a union to a tuple
export type UnionToTuple<T, L = T> = [T] extends [never]
    ? []
    : [L] extends [never]
    ? []
    : L extends L
    ? [L, ...UnionToTuple<Exclude<T, L>>]
    : never;
