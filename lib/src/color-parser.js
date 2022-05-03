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
export class ColorParserBuilder {
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
        return new ColorParserHandler(
            value => typeof value === 'string' && value.trim().startsWith('--'),
            value => `var(${value.trim()})`
        );
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
        return new ColorParserHandler(
            value => typeof value === 'string' && CSS.supports('color', value.trim()),
            value => value.trim()
        );
    }
}
