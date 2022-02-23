import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import clear from 'rollup-plugin-clear';
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
    resolve(),
    typescript(),
    copy({
      targets: [
        {
          src: [
            'index.html',
            'src/assets/*',
            join(
              node_modules,
              '@webcomponents/webcomponentsjs/webcomponents-loader.js'
            ),
            join(node_modules, 'lit/polyfill-support.js'),
            join(node_modules, 'bootstrap/dist/css/bootstrap.min.css'),
          ],
          dest: PUBLIC,
        },
      ],
    }),
  ],
};
