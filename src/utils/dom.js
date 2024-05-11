export function waitForDomUpdate() {
    return new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
}
export function getActiveElement() {
    let active = document.activeElement;
    while (active && active.shadowRoot) {
        active = active.shadowRoot.activeElement;
    }
    return active;
}

/**@param {HTMLElement} elem */
export function setCaretAtEnd(elem) {
    const range = document.createRange(); // Create a range (a range is a like the selection but invisible)
    const selection = window.getSelection(); // Get the current selection
    range.selectNodeContents(elem); // Select the entire contents of the element
    range.collapse(false); // Collapse the range to the end point. False means collapse to end rather than the start
    selection.removeAllRanges(); // Remove all selections before we add our new range
    selection.addRange(range); // Add the new range
    elem.focus(); // Optional: if the element can receive focus
}

/**
 * @param {HTMLElement} parent
 * @param {HTMLElement} child
 * @param {string} [selector]
 */
export function getIndexOfChild(parent, child, selector) {
    let children =
        typeof selector == "string"
            ? parent.querySelectorAll(selector)
            : parent.children;

    for (let i = 0; i < children.length; i++) {
        const currentChild = children[i];
        if (currentChild == child) {
            return i;
        }
    }
    return -1;
}

/**
 *
 * @param {HTMLElement} parent
 * @param {number} index
 */
export function getChildByIndex(parent, index) {
    for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i];
        if (i == index) {
            return child;
        }
    }
}

/**
 * Finds the next or previous sibling element that matches a given selector.
 *
 * @param {Element} element - The starting HTML element.
 * @param {keyof HTMLElementTagNameMap | string} selector - The CSS selector to match the sibling elements.
 * @param {boolean} next - Flag to determine direction; true for next, false for previous.
 * @returns {HTMLElement | null} The matched sibling element or null if no match is found.
 */
export function findMatchingSibling(element, selector, next) {
    // Initialize the variable to hold the current sibling element
    let sibling = element;

    // Loop to find the matching sibling
    while (sibling) {
        // Move to the next or previous sibling based on the 'next' flag
        sibling = next
            ? sibling.nextElementSibling
            : sibling.previousElementSibling;

        // Check if the sibling matches the selector
        if (sibling && sibling.matches(selector)) {
            return sibling; // Return the matched sibling
        }
    }

    // Return null if no matching sibling is found
    return null;
}
