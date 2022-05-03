/**
 * Handler for input property 'color-after-text'
 * that can be used on the web component to
 * move the color block after the text.
 *
 * By default, the color block is before the text, sexier that way.
 */
export class ColorAfterTextAttribute {
    static ATTR_COLOR_AFTER_TEXT = 'color-after-text';

    _shadowRoot;
    _colorBlockEl;

    constructor(shadowRoot, colorBlock) {
        this._shadowRoot = shadowRoot;
        this._colorBlockEl = colorBlock.getElement();
    }

    /**
     * Looks like an attribute changed, so check it
     * and move the color block in consequences.
     *
     * @param name {string} changed attribute name
     * @param value {string} attribute's value
     */
    onAttributeChanged(name, value) {
        if (!this._handle(name)) {
            return;
        }

        if (value === 'true') {
            this._shadowRoot.appendChild(this._colorBlockEl);
        } else {
            this._shadowRoot.prepend(this._colorBlockEl);
        }
    }

    _handle(name) {
        return name === ColorAfterTextAttribute.ATTR_COLOR_AFTER_TEXT;
    }
}
