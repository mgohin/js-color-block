/**
*
 * color-block
 * 1.0.0
 * Maelig GOHIN
 *
 */
var colorblock = (function (exports) {
    'use strict';

    window.ColorBlockConfiguration = {
      clipboard: {
        validColorTitle: value => `click to copy value ${value}`,
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
        <span class="color-text"></span>
        `;
      return template;
    };

    class ColorParserBuilder {
      static ifValid(validCb) {
        return new ColorParserBuilderIfInvalid(validCb);
      }

    }

    class ColorParserBuilderIfInvalid {
      _validCb;

      constructor(validCb) {
        this._validCb = validCb;
      }

      ifInvalid(invalidCb) {
        return new ColorParser(this._validCb, invalidCb);
      }

    }

    class ColorParser {
      _validCb;
      _invalidCb;
      parsers = [ColorParserHandler.CssVar(), ColorParserHandler.OtherCssColors()];

      constructor(validCb, invalidCb) {
        this._validCb = validCb;
        this._invalidCb = invalidCb;
      }

      parse(value) {
        const parser = this.parsers.find(parser => parser.handle(value));

        if (parser) {
          this._validCb(parser.format(value));
        } else {
          this._invalidCb(value);
        }
      }

    }

    class ColorParserHandler {
      _handleCb;
      _parseCb;

      constructor(handleCb, parseCb) {
        this._handleCb = handleCb;
        this._parseCb = parseCb;
      }

      handle(value) {
        return this._handleCb(value);
      }

      format(value) {
        return this._parseCb(value);
      }

      static CssVar() {
        return new ColorParserHandler(value => typeof value === 'string' && value.trim().startsWith('--'), value => `var(${value.trim()})`);
      }

      static OtherCssColors() {
        return new ColorParserHandler(value => typeof value === 'string' && CSS.supports('color', value.trim()), value => value.trim());
      }

    }

    class CopyToClipboard {
      _colorBlockEl;
      _clickListener;

      constructor(colorBlock) {
        this._colorBlockEl = colorBlock.getElement();
      }

      bindValid(value) {
        this._colorBlockEl.setAttribute('title', ColorBlockConfiguration.clipboard.validColorTitle(value));

        this._bind(value);
      }

      bindInvalid(value) {
        this._colorBlockEl.setAttribute('title', ColorBlockConfiguration.clipboard.invalidColorTitle(value));

        this._bind(value);
      }

      _bind(value) {
        this._clickListener = () => this._copyToClipBoard(value);

        this._colorBlockEl.addEventListener('click', this._clickListener);
      }

      unbind() {
        if (this._clickListener) {
          this._colorBlockEl.removeEventListener('click', this._clickListener);

          this._clickListener = null;
        }
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

    class ColorBlock {
      _htmlEl;

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

    class ColorAfterTextAttribute {
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

    class ColorBlockWebComponent extends HTMLElement {
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
        this.attachShadow({
          mode: 'open'
        });
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

    } // Define the new element

    customElements.define('color-block', ColorBlockWebComponent);

    exports.ColorBlockWebComponent = ColorBlockWebComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=color-block.1.0.0.es.js.map