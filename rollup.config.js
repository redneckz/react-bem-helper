import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

const ENV = process.env.NODE_ENV;

const ENV_TO_MODULE_FORMAT = {
    cjs: 'cjs',
    es: 'es',
    development: 'umd',
    production: 'umd'
};

export default {
    input: 'src/index.js',
    external: ['react', 'prop-types'],
    output: Object.assign(
        {
            format: ENV_TO_MODULE_FORMAT[ENV],
            sourcemap: true
        },
        (ENV === 'development' || ENV === 'production') && {
            output: {
                name: 'BEM',
                globals: {
                    react: 'React',
                    'prop-types': 'PropTypes'
                }
            }
        }
    ),
    plugins: [
        babel({
            babelrc: false,
            exclude: ['node_modules/**', '*.spec.js'],
            presets: [
                ['env', {
                    targets: (ENV === 'cjs')
                        ? {node: 'current'}
                        : {browsers: ['last 2 versions', 'ie >= 11']},
                    modules: false,
                    loose: true
                }],
                'react'
            ],
            plugins: [
                'external-helpers',
                'transform-object-rest-spread'
            ]
        }),
        resolve({
            jsnext: true,
            browser: true
        }),
        commonjs(),
        (ENV === 'production') &&
            uglify({
                keep_fnames: true,
                compress: {
                    pure_getters: true,
                    warnings: false
                }
            })
    ]
};
