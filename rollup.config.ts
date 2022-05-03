import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';

var pjson = require('./package.json');

const banner = () => {
    return `/**
*
 * ${pjson.name}
 * ${pjson.version}
 * ${pjson.author}
 *
 */`;
};

export default {
    input: 'lib/index.js',
    output: {
        sourcemap: true,
        name: 'colorblock',
        file: `dist/color-block.js`,
        format: 'es',
        banner: banner()
    },
    plugins: [
        babel({babelHelpers: 'bundled'}),
        copy({
            hook: 'closeBundle',
            targets: [
                {src: `dist/color-block.js*`, dest: `docs/public`}
            ]
        })
    ]
};

