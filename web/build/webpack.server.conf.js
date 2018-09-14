const merge = require('webpack-merge')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.base.conf.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(baseConfig, {
  entry: './src/main-server.js',
  target: 'node',
  devtool: '#source-map',
  output: {
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: false,
      usePostCSS: true
    })
  },
  externals: nodeExternals({
    whitelist: /\.css$/
  }),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.VUE_ENV': '"server"'
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../mapFile/static'),
        to: 'dist/static',
        ignore: ['.*']
      }
    ]),
    new VueSSRServerPlugin()
  ]
})