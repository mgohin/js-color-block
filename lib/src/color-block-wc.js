import './configuration';

import {getTemplate} from './template';
import {ColorBlock} from './color-block';
import {ColorAfterTextAttribute} from './color-after-text-attribute.js';

export class ColorBlockWebComponent extends HTMLElement {

    static get observedAttributes() {
        return [ColorAfterTextAttribute.ATTR_COLOR_AFTER_TEXT];
    }

    _colorText;
    _colorBlock;

    _colorAfterTextAttribute;

    constructor() {
        super();

        this._createTemplate();
        this._bindElements();

        this._colorAfterTextAttribute = new ColorAfterTextAttribute(this.shadowRoot, this._colorBlock);
    }

    _createTemplate() {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(getTemplate().content.cloneNode(true));
    }

    _bindElements() {
        this._colorText = this.shadowRoot.querySelector('.color-text');
        this._colorBlock = new ColorBlock(this.shadowRoot.querySelector('.color-block'));
    }

    connectedCallback() {
        setTimeout(() => {
            this._colorText.innerHTML = this.textContent;
            this._colorBlock.setColor(this.textContent);
        });
    }

    disconnectedCallback() {
        this._colorBlock.disconnect();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this._colorAfterTextAttribute.onAttributeChanged(name, newValue);
    }
}

// Define the new element
customElements.define('color-block', ColorBlockWebComponent);
