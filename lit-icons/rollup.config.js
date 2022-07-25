import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import clear from 'rollup-plugin-clear';

const DIST = './dist';
export default {
  input: 'src/index.ts',
  output: {
    dir: DIST,
    format: 'es',
    // sourcemap: true,
  },
  plugins: [
    clear({
      targets: [DIST],
    }),
    resolve(),
    typescript(),
  ],
};
