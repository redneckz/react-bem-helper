import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';

const ENV = process.env.NODE_ENV;

const MODULE_FORMAT = {
    cjs: 'cjs',
    es: 'es',
    development: 'umd',
    production: 'umd',
}[ENV];

export default {
    input: 'src/index.js',
    external: ['react'],
    output: Object.assign(
        {
            format: MODULE_FORMAT,
            sourcemap: true,
        },
        (ENV === 'development' || ENV === 'production') && {
            name: 'BEM',
            globals: {
                react: 'React',
            },
        },
    ),
    plugins: [
        babel({
            babelrc: false,
            exclude: ['node_modules/**', '*.spec.js'],
            presets: [
                [
                    'env',
                    {
                        targets: { browsers: ['last 2 versions', 'ie >= 11'] },
                        modules: false,
                        loose: true,
                    },
                ],
                'react',
            ],
            plugins: [
                'transform-flow-strip-types',
                'external-helpers',
                'transform-object-rest-spread',
            ],
        }),
        resolve({
            jsnext: true,
            browser: true,
            extensions: ['.js', '.jsx'],
        }),
        commonjs(),
        ENV === 'production' &&
            uglify({
                keep_fnames: true,
                compress: {
                    pure_getters: true,
                    warnings: false,
                },
            }),
    ],
};
