import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import typescript from 'rollup-plugin-typescript2';

export default {
  plugins: [
    typescript(),
    nodeResolve({
      jsnext: true,
      browser: true
    }),
    commonjs(),
    uglify()
  ]
};
