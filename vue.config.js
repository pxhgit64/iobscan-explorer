const path = require('path') //引入path模块
function resolve(dir) {
  return path.join(__dirname, dir) //path.join(__dirname)设置绝对路径
}

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target:'https://irishub.iobscan.io/api',
        secure: false,
        pathRewrite: { '^/api': '' },
      },
      '/lcd': {
        target: 'https://irishub.iobscan.io/lcd',
        secure: false,
        pathRewrite: { '^/lcd': '' },
      }
    },
  },
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('./src'))
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/style/variable.scss";@import "@/style/productization.scss";`,
      },
    },
  },
}
