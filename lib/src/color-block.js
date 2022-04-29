import {ColorParserBuilder} from './color-parser';
import {CopyToClipboard} from './clipboard';

export class ColorBlock {
    _htmlEl;

    constructor(htmlEl) {
        this._htmlEl = htmlEl;
        this._colorEl = htmlEl.querySelector('.color-block .color');

        this._copyToClipboard = new CopyToClipboard(this);
        this._colorParser = ColorParserBuilder
            .ifValid(this._setValidColor.bind(this))
            .ifInvalid(this._setInvalidColor.bind(this));
    }

    getElement() {
        return this._htmlEl;
    }

    setColor(value) {
        this._colorParser.parse(value);
    }

    disconnect() {
        this._copyToClipboard.unbind();
    }

    _setValidColor(color) {
        this._colorEl.style.backgroundColor = color;
        this._copyToClipboard.bindValid(color);
    }

    _setInvalidColor(value) {
        this._colorEl.classList.add('invalid');
        this._copyToClipboard.bindInvalid(value);
    }
}
