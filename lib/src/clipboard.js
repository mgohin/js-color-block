/**
 * Handler for clipboard copy on a {@link ColorBlock}
 */
export class CopyToClipboard {

    _colorBlockEl;
    _clickListener;

    /**
     * @constructor
     * @param colorBlock {ColorBlock} ColorBlock to attach the copy interaction
     */
    constructor(colorBlock) {
        this._colorBlockEl = colorBlock.getElement();
    }

    /**
     * Set 'valid' title on the block and bind the copy interaction
     * @param value {string} valid value to copy
     */
    bindValid(value) {
        this._colorBlockEl.setAttribute('title', ColorBlockConfiguration.clipboard.validColorTitle(value));
        this._bind(value);
    }

    /**
     * Set 'invalid' title on the block and bind the copy interaction
     * @param value {string} valid value to copy
     */
    bindInvalid(value) {
        this._colorBlockEl.setAttribute('title', ColorBlockConfiguration.clipboard.invalidColorTitle(value));
        this._bind(value);
    }

    /**
     * Remove bound listener to clean things up
     */
    unbind() {
        if (this._clickListener) {
            this._colorBlockEl.removeEventListener('click', this._clickListener);
            this._clickListener = null;
        }
    }

    _bind(value) {
        this._clickListener = () => this._copyToClipBoard(value);
        this._colorBlockEl.addEventListener('click', this._clickListener);
    }

    _clearCopyState() {
        this._colorBlockEl.classList.remove('copy-success');
        this._colorBlockEl.classList.remove('copy-failed');
    }

    _copySuccess() {
        this._newCopyState('success');
    }

    _copyFailed() {
        this._newCopyState('failed');
    }

    _newCopyState(state) {
        this._clearCopyState();
        this._colorBlockEl.classList.add('copy');
        this._colorBlockEl.classList.add('copy-' + state);
        setTimeout(() => {
            this._colorBlockEl.classList.remove('copy');
            this._colorBlockEl.classList.remove('copy-' + state);
        }, 500);
    }

    _copyToClipBoard(color) {
        navigator.clipboard.writeText(color)
            .then(() => {
                this._copySuccess();
            }, () => {
                this._copyFailed();
            });
    }
}
