import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import clear from 'rollup-plugin-clear';
import bundleHtml from './buildhtml.js';
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
    typescript(),
    copy({
      targets: [
        {
          src: [
            'src/assets/*',
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
    bundleHtml({ dest: join(PUBLIC, 'index.html') }),
  ],
};
