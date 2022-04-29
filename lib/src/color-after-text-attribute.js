export class ColorAfterTextAttribute {
    static ATTR_COLOR_AFTER_TEXT = 'color-after-text';

    _shadowRoot;
    _colorBlockEl;

    constructor(shadowRoot, colorBlock) {
        this._shadowRoot = shadowRoot;
        this._colorBlockEl = colorBlock.getElement();
    }

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
