/**
*
 * color-block
 * 1.0.0
 * Maelig GOHIN <maelig.gohin@gmail.com> (https://mgohin.github.io/js-color-block/)
 *
 */
/**
 * Global configuration object with default values.
 *
 * You can override anything you want.
 * Just be sure to respect 'contracts' of each value.
 *
 * I'm a lazy dev, I did not check if you passed a function or a different type.
 *
 * @type {{clipboard: {validColorTitle: (function(*): string), invalidColorTitle: (function(*): string)}}}
 */
window.ColorBlockConfiguration = {
  /**
   * clipboard messages
   */
  clipboard: {
    /**
     * title to display on the color block when the {@code value} is valid
     * @param value {string} valid css color value
     * @return {string} message to display
     */
    validColorTitle: value => `click to copy value ${value}`,

    /**
     * title to display on the color block when the {@code value} is invalid
     * @param value {string} invalid value
     * @return {string} message to display
     */
    invalidColorTitle: value => `${value} is an invalid color - click to copy value`
  }
};

const getTemplate = () => {
  const template = document.createElement('template');
  template.innerHTML = `
        <style>
        
        :host {
            display: inline-block;
        }
        
        .color-block {
          position: relative;
          display: inline-block;
          width: 10px;
          height: 10px;
          line-height: 10px;
          border: 1px solid #444;
        }
        
        .color-block .color {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 10px;
            height: 10px;
        }
        
        .color-block.copy::after {
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          
          width: 10px;
          height: 10px;
          line-height: 10px;
          text-align: center;
          
          animation-duration: .5s;
          animation-name: botToTop;
        }
        
        .color-block.copy-success::after {
          content: '\\2713';
          font-size: 16px;
          color: green;
        }
        
        .color-block.copy-failed::after {
          content: '\\00D7';
          font-size: 16px;
          color: red;
        }
        
        @keyframes botToTop  {
           0% {
              top:0;
              opacity: 0;
           }
           
           50% {
            opacity: 1;
           }
           
           100% {
              top:-200%;
              opacity: 0;
           }
        
        }
        
        .color-block .color.invalid {
            position: relative;
        }
        
        .color-block .color.invalid::before,
        .color-block .color.invalid::after {
            position: absolute;
            content: '';
            width: 100%;
            top: 50%;
            height: 1px;
            background-color: red;
        }
        
        .color-block .color.invalid::before {
            transform: rotate(45deg);
        }
        
        .color-block .color.invalid::after {
            transform: rotate(-45deg);
        }
        </style>
        <span class="color-block">
            <span class="color"></span>
            <span class="copy"></span>
        </span>
        <slot></slot>
        `;
  return template;
};

/**
 * Builder to get a color parser.
 * This is the entrypoint to create a ColorParser.
 *
 * @example
 * ColorParserBuilder
 *    .ifValid(value => checkIfValidValue(value))
 *    .ifInvalid(value => parseValidValue(value));
 *
 * Note: Multiple private classes are used to force the
 * developer to set ifValid and ifInvalid callbacks.
 */
class ColorParserBuilder {
  static ifValid(validCb) {
    return new ColorParserBuilderIfInvalid(validCb);
  }

}
/**
 * Builder for ifInvalid callback
 */

class ColorParserBuilderIfInvalid {
  _validCb;

  constructor(validCb) {
    this._validCb = validCb;
  }

  ifInvalid(invalidCb) {
    return new ColorParser(this._validCb, invalidCb);
  }

}
/**
 * Color parser
 */


class ColorParser {
  _validCb;
  _invalidCb;
  parsers = [ColorParserHandler.CssVar(), ColorParserHandler.OtherCssColors()];

  constructor(validCb, invalidCb) {
    this._validCb = validCb;
    this._invalidCb = invalidCb;
  }
  /**
   * Iterate through {@link parsers} to get a parser that
   * can parse correctly the {@code value}.
   *
   * @param value {string} string to parse as a CSS color
   */


  parse(value) {
    const parser = this.parsers.find(parser => parser.handle(value));

    if (parser) {
      this._validCb(parser.format(value));
    } else {
      this._invalidCb(value);
    }
  }

}
/**
 * Represents a specific parser.
 *
 * You can define your own.
 * It predefines some parsers :
 * - {@link CssVar}
 * - {@link OtherCssColors}
 */


class ColorParserHandler {
  _handleCb;
  _parseCb;

  constructor(handleCb, parseCb) {
    this._handleCb = handleCb;
    this._parseCb = parseCb;
  }
  /**
   * Can this parser handle the {@code value} ?
   *
   * @param value {string} value to parse
   * @return {boolean} true if the {@code value} car be formatted
   */


  handle(value) {
    return this._handleCb(value);
  }
  /**
   * Format the {@code value}
   *
   * @param value {string} value to format
   * @return {string} formatted value
   */


  format(value) {
    return this._parseCb(value);
  }
  /**
   * Parser to handle css var color
   *
   * @example
   * --my-custom-color
   *
   * @return {ColorParserHandler} the parser
   */


  static CssVar() {
    return new ColorParserHandler(value => typeof value === 'string' && value.trim().startsWith('--'), value => `var(${value.trim()})`);
  }
  /**
   * Parser to handle css colors
   *
   * @example
   * #AA66DD
   * blue
   * hsl(9,100%,64%)
   * rgba(255,99,71,0.5)
   *
   * @return {ColorParserHandler} the parser
   */


  static OtherCssColors() {
    return new ColorParserHandler(value => typeof value === 'string' && CSS.supports('color', value.trim()), value => value.trim());
  }

}

/**
 * Handler for clipboard copy on a {@link ColorBlock}
 */
class CopyToClipboard {
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
    navigator.clipboard.writeText(color).then(() => {
      this._copySuccess();
    }, () => {
      this._copyFailed();
    });
  }

}

/**
 * Represents the color block itself
 * with its color parser and interactions
 */

class ColorBlock {
  _htmlEl;
  _colorEl;
  _copyToClipboard;
  _colorParser;

  constructor(htmlEl) {
    this._htmlEl = htmlEl;
    this._colorEl = htmlEl.querySelector('.color-block .color');
    this._copyToClipboard = new CopyToClipboard(this);
    this._colorParser = ColorParserBuilder.ifValid(this._setValidColor.bind(this)).ifInvalid(this._setInvalidColor.bind(this));
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

/**
 * Handler for input property 'color-after-text'
 * that can be used on the web component to
 * move the color block after the text.
 *
 * By default, the color block is before the text, sexier that way.
 */
class ColorAfterTextAttribute {
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

/**
 * Represents the web component itself.
 *
 * One input is available :
 *  - color-after-text : if 'true', it'll move the color block after the text.
 *      By default, the color block is before the text
 */

class ColorBlockWebComponent extends HTMLElement {
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
    this.attachShadow({
      mode: 'open'
    });
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

customElements.define('color-block', ColorBlockWebComponent);
//# sourceMappingURL=color-block.js.map
