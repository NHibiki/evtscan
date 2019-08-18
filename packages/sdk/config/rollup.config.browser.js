import config from './rollup.config';

export default {
  input: 'src/browser.ts',
  output: [
    {
      file: '../../dist/evtscan.js',
      format: 'iife',
      sourcemap: true,
      name: 'EvtScan'
    }
  ],
  ...config
};
