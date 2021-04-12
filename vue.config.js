const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const { projectName } = require('./src/config')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: isProduction ? '././' : '',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    open: false, // 自动打开浏览器
    port: '7093',
  },
  configureWebpack: config => {
    if(isProduction) {
      return {
        plugins: [new CompressionPlugin({
          test: /\.js$|\.html$|\.css/, // 匹配文件名
          threshold: 10240, // 对超过10K的进行压缩
          deleteOriginalAssets: false, // 是否删除原文件
        })]
      }
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      // 设置页面title
      args[0].title = projectName
      return args
    })
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', resolve('src'))
      .end()
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }

}