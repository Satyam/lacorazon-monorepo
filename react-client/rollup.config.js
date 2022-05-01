import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import clear from 'rollup-plugin-clear';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';

import { join } from 'path';

const PUBLIC = '../public';
const node_modules = '../node_modules';

export default {
  input: 'src/index.tsx',
  output: {
    dir: PUBLIC,
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    clear({
      targets: [PUBLIC],
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
};
