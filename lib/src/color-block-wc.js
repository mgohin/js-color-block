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

    _slotEl;
    _slotListener;
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
        this._slotEl = this.shadowRoot.querySelector('slot');
        this._colorBlock = new ColorBlock(this.shadowRoot.querySelector('.color-block'));
    }

    connectedCallback() {
        this._slotListener = () => this._updateColor();
        this._slotEl.addEventListener('slotchange', this._slotListener);
        this._updateColor();
    }

    _updateColor() {
        const nodes = this._slotEl.assignedNodes();
        const contentAsString = Array.from(nodes).map(node => node.textContent).join('');
        this._colorBlock.setColor(contentAsString);
    }

    disconnectedCallback() {
        this._colorBlock.disconnect();
        if (this._slotListener) {
            this._slotEl.removeEventListener('slotchange', this._slotListener);
            this._slotListener = null;
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this._colorAfterTextAttribute.onAttributeChanged(name, newValue);
    }
}
