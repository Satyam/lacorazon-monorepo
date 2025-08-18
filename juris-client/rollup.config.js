import copy from 'rollup-plugin-copy';
import clear from 'rollup-plugin-clear';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import concat from 'rollup-plugin-concat';
import { join } from 'path';
import { globSync } from 'glob';

const PUBLIC = '../public';
const node_modules = '../node_modules';

export default {
  input: join(PUBLIC, 'tmp.js'),
  output: {
    file: join(PUBLIC, 'index.js'),
    footer: 'juris.render("#container");',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    concat({
      groupedFiles: [
        {
          files: globSync([
            './index.js',
            './components/**/*.js',
            './headless/**/*.js',
            './pages/**/*.js',
            './Routes.js',
          ]),
          outputFile: join(PUBLIC, 'tmp.js'),
        },
      ],
    }),
    commonjs(),
    clear({
      targets: [PUBLIC],
    }),
    resolve(),

    copy({
      targets: [
        {
          src: [
            'index.html',
            'assets/*',
            join(node_modules, 'bootstrap/dist/css/bootstrap.min.css'),
            join(node_modules, 'bootstrap-icons/font/bootstrap-icons.css'),
          ],
          dest: PUBLIC,
        },
        {
          src: join(
            node_modules,
            'bootstrap-icons/font/fonts/bootstrap-icons.woff2'
          ),
          dest: join(PUBLIC, 'fonts'),
        },
      ],
    }),
  ],
};
