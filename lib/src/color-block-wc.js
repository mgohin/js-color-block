import './configuration';

import {getTemplate} from './template';
import {ColorBlock} from './color-block';
import {ColorAfterTextAttribute} from './color-after-text-attribute.js';

/**
 * Represents the web component itself.
 *
 * One input is available :
 *  - color-after-text : if 'true', it'll move the color block after the text.
 *      By default, the color block is before the text
 */
export class ColorBlockWebComponent extends HTMLElement {

    static get observedAttributes() {
        return [ColorAfterTextAttribute.ATTR_COLOR_AFTER_TEXT];
    }

    _colorTextEl;
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
        this._colorTextEl = this.shadowRoot.querySelector('.color-text');
        this._colorBlock = new ColorBlock(this.shadowRoot.querySelector('.color-block'));
    }

    connectedCallback() {
        setTimeout(() => {
            this._colorTextEl.innerHTML = this.textContent;
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
