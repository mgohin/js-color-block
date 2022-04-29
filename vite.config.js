const path = require('path');
const {defineConfig} = require('vite');

module.exports = defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'lib/main.js'),
            name: 'MyLib',
            fileName: (format) => `color-block.${format}.js`
        }
    }
});
