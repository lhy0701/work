const webpack = require('webpack')

const NODE_ENV = process.env.NODE_ENV

module.exports = {
    baseUrl: NODE_ENV === 'production' ? '/backend/' : '/',
    chainWebpack: config => {
        config.plugin('define').use(webpack.DefinePlugin, [{
            __DEV__: NODE_ENV === 'development' ? true : false,
            __TEST__: NODE_ENV === 'test' ? true : false,
            __PRODUCTION__: NODE_ENV === 'production' ? true : false
        }])
    },
    runtimeCompiler: true,
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/test': {
                // target: 'http://192.168.1.253',
                // target: 'http://192.168.1.14:8080/',
                target: 'http://192.168.1.138:9001/', // 测试
                // target: 'http://192.168.1.147:8080/', // 开发
                // target: 'http://59.110.126.150:8080/', // 生产
                // target: 'http://192.168.1.31:8080/', // 强哥
                // target: 'http://39.106.121.128:8080/', // 准生产
                // target: 'http://192.168.1.129:8080/', // 陈阔
                pathRewrite: {
                    '^/test': ''
                }
            },
            '/prod': {
                target: 'http://39.106.121.128:8080/',
                pathRewrite: {
                    '^/prod': ''
                }
            }
        }
    }
}