// vue.config.js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  lintOnSave: false,
  transpileDependencies: ['*'], // 解决npm run serve某些node_modules依赖不能被babel编译问题
  productionSourceMap: process.env.NODE_ENV === 'development',
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: process.env.BASE_URL,
  assetsDir: 'static',
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')
  },
  configureWebpack: {
    performance: {
      hints: false
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              drop_console: true,// console
              drop_debugger: false,
              pure_funcs: ['console.log']// 移除console
            }
          }
        })
      ]
    }
  },
  devServer: {
    proxy: {
      // 第三方报表代理
      '/report': {
        target: 'http://10.6.0.34:8080', // 报表
        changeOrigin: true,
        pathRewrite: {
          '^/report': '/'
        }
      },
      // 第三方BI代理
      '/bi': {
        target: 'http://10.6.0.33:28080', // BI
        changeOrigin: true,
        pathRewrite: {
          '^/bi': '/'
        }
      }
    },
    overlay: {
      warnings: false,
      errors: false
    }
  }
}