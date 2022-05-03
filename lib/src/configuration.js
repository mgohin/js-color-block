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
        validColorTitle: (value) => `click to copy value ${value}`,
        /**
         * title to display on the color block when the {@code value} is invalid
         * @param value {string} invalid value
         * @return {string} message to display
         */
        invalidColorTitle: (value) => `${value} is an invalid color - click to copy value`
    }
}
