import {terser} from 'rollup-plugin-terser';
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

const baseOutputConfig = {
    sourcemap: true,
    name: 'colorblock',
    banner: banner()
};

const baseOutputConfigIIFE = {
    ...baseOutputConfig,
    format: 'iife'
};

const outputConfigIIFE = [
    {
        ...baseOutputConfigIIFE,
        file: `dist/color-block.${pjson.version}.iife.js`
    },
    {
        ...baseOutputConfigIIFE,
        file: `dist/color-block.${pjson.version}.iife.min.js`,
        plugins: [terser()]
    }
];

const baseOutputConfigES = {
    ...baseOutputConfig,
    format: 'es'
};

const outputConfigES = [
    {
        ...baseOutputConfigIIFE,
        file: `dist/color-block.${pjson.version}.es.js`
    },
    {
        ...baseOutputConfigIIFE,
        file: `dist/color-block.${pjson.version}.es.min.js`,
        plugins: [terser()]
    }
];

export default {
    input: 'lib/src/color-block-wc.js',
    output: [
        ...outputConfigIIFE,
        ...outputConfigES
    ],
    plugins: [
        babel({babelHelpers: 'bundled'}),
        copy({
            hook: 'closeBundle',
            targets: [
                {src: `dist/color-block.${pjson.version}.iife.min.js`, dest: `docs/public`},
                {src: `dist/color-block.${pjson.version}.es.min.js`, dest: `docs/public`}
            ]
        })
    ]
};

