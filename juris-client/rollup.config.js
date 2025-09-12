import copy from 'rollup-plugin-copy';
import clear from 'rollup-plugin-clear';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';

// import addImports from './rollupAddImports.js';

import { join } from 'path';

const PUBLIC = '../public';
const node_modules = '../node_modules';

export default {
  input: './src/render.js',
  output: {
    file: join(PUBLIC, 'index.js'),
    format: 'es',
    sourcemap: true,
  },
  jsx: {
    mode: 'classic',
    factory: 'h',
    importSource: '@src/utils.js',
  },
  onLog(level, log, handler) {
    // console.log(JSON.stringify(log, null, 2));
    if (log.code === 'PLUGIN_WARNING' && log.plugin === 'alias') return;
    handler(level, log);
  },
  plugins: [
    alias({
      entries: {
        '@src': './src',
        '@pages': './src/pages',
        '@headless': './src/headless',
        '@components': './src/components',
      },
    }),
    // addImports(),
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
