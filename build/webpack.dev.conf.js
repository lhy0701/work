const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const webpackConfigBase = require('./webpack.base.conf')
const webpackConfigDev = {
    mode: 'development', // 通过 mode 声明开发环境
    output: {
        path: path.resolve(__dirname, '../dist'),
        // 打包多出口文件
        // 生成 a.bundle.[hash].js  b.bundle.[hash].js
        filename: './js/[name].bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, '../src'),
        publicPath: '/',
        host: '',
        port: '8089',
        overlay: true, // 浏览器页面上显示错误
        open: true, // 开启浏览器
        // stats: "errors-only", //stats: "errors-only"表示只打印错误：
        hot: true, // 开启热更新
        proxy: {
            '/yunstore': {
                // 60.205.222.142
                // 39.106.15.185:8080
                target: 'https://39.106.15.185:8080', //'http://60.205.224.28:8080/YSService.svc/DoService',
                pathRewrite: { '^/yunstore': '' }
            },
            '/payment': {
                target: 'https://www.joinpay.com/trade/uniPayApi.action',
                pathRewrite: { '^/payment': '' }
            }
        }
    },
    plugins: [
        //热更新
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    // devtool: "source-map",  // 开启调试模式
    module: {
        rules: []
    }
}

module.exports = merge(webpackConfigBase, webpackConfigDev)