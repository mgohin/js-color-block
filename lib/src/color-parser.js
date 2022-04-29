export class ColorParserBuilder {
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
        return new ColorParserHandler(
            value => typeof value === 'string' && value.trim().startsWith('--'),
            value => `var(${value.trim()})`
        );
    }

    static OtherCssColors() {
        return new ColorParserHandler(
            value => typeof value === 'string' && CSS.supports('color', value.trim()),
            value => value.trim()
        );
    }
}
