import config from './rollup.config';

export default {
  input: 'src/node.ts',
  output: [
    {
      file: '../../dist/main.js',
      format: 'umd',
      sourcemap: true,
      name: 'EvtScan'
    }
  ],
  ...config
};
