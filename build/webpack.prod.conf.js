const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const cleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// const extractTextPlugin = require('extract-text-webpack-plugin')
const webpackConfigBase = require('./webpack.base.conf')
const webpackConfigProd = {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: './js/[name].[hash].js',
    publicPath: './'
  },
  devtool: 'cheap-source-map',
  plugins: [
    new cleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../'), //根目录
      verbose: true, //开启在控制台输出信息

      dry: false
    }),
    // 分离css插件参数为提取出去的路径
    // new extractTextPlugin({
    //   filename: 'css/[name].[hash:8].min.css'
    // }),
    //压缩css
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new UglifyJSPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          drop_debugger: false,
          drop_console: true
        }
      }
    })
    // new BundleAnalyzerPlugin()
  ],
  module: {
    rules: []
  }
}
module.exports = merge(webpackConfigBase, webpackConfigProd)
