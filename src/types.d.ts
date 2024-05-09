import {
    CustomMomentaryElement,
    CustomToggleElement,
} from "./custom-elements/x-button";
import { CustomNumberElement } from "./custom-elements/x-number";
import { CustomRangeElement } from "./custom-elements/x-range";
import {
    CustomOptionElement,
    CustomSelectElement,
} from "./custom-elements/x-select";

declare global {
    interface HTMLElementTagNameMap {
        "x-momentary": CustomMomentaryElement;
        "x-toggle": CustomToggleElement;
        "x-select": CustomSelectElement;
        "x-option": CustomOptionElement;
        "x-range": CustomRangeElement;
        "x-number": CustomNumberElement;
    }

    type InputSelector =
        "x-momentary,x-toggle,x-select,x-option,x-range,x-number";
    type InputElementUnion =
        | CustomMomentaryElement
        | CustomToggleElement
        | CustomSelectElement
        | CustomRangeElement
        | CustomNumberElement;

    interface ParentNode {
        querySelectorAll<K extends InputSelector>(
            selectors: K
        ): NodeListOf<InputElementUnion>;
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

    interface ShadowRoot {
        addEventListener<K extends keyof HTMLElementEventMap>(
            type: K,
            listener: (this: ShadowRoot, ev: HTMLElementEventMap[K]) => any,
            options?: boolean | AddEventListenerOptions
        ): void;
    }
}

// Utility type to transform a union to a tuple
export type UnionToTuple<T, L = T> = [T] extends [never]
    ? []
    : [L] extends [never]
    ? []
    : L extends L
    ? [L, ...UnionToTuple<Exclude<T, L>>]
    : never;
