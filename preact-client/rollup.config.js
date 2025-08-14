import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import clear from 'rollup-plugin-clear';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';

import alias from '@rollup/plugin-alias';

import { join } from 'path';

const PUBLIC = '../public';
const node_modules = '../node_modules';

export default {
  input: 'src/index.ts',
  output: {
    dir: PUBLIC,
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    clear({
      targets: [PUBLIC],
    }),
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
        { find: 'react-dom', replacement: 'preact/compat' },
        { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
      ],
    }),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify('production'),
        __buildDate__: () => JSON.stringify(new Date()),
        __buildVersion: 15,
      },
    }),
    resolve(),

    commonjs(),
    typescript(),
    postcss({
      modules: true,
    }),
    copy({
      targets: [
        {
          src: [
            'src/assets/*',
            join(node_modules, 'bootstrap/dist/css/bootstrap.min.css'),
            join(node_modules, 'bootstrap/dist/css/bootstrap.min.css.map'),
          ],
          dest: PUBLIC,
        },
      ],
    }),
  ],
  onwarn: (log, handler) => {
    // console.log(JSON.stringify(log, null, 2));
    if (log.code === 'MODULE_LEVEL_DIRECTIVE') return;
    handler(log);
  },
};
