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
