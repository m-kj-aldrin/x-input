const customListTemplate = document.createElement("template");
customListTemplate.innerHTML = `
<style>
    :host{
        border: 1px currentColor solid;
        width: max-content;
    }
    #list{
        display: flex;
        flex-direction: column;
        padding: var(--padding,4px);
        gap: var(--gap,4px);
    }
</style>
<div id="list">
    <slot></slot>
</div>
`;

export class CustomListElement extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        this.shadowRoot.append(customListTemplate.content.cloneNode(true));
    }

    connectedCallback() {}
    disconnectedCallback() {}
}
