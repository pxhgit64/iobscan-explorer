const path = require('path') //引入path模块
function resolve(dir) {
  return path.join(__dirname, dir) //path.join(__dirname)设置绝对路径
}
const productionConfig = require('./src/productionConfig.js')
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target:'http://localhost:3000/',
        // target:'https://irishub.iobscan.io/api/ ',
        // target:'http://192.168.150.42:10001/api/',
        secure: false,
        pathRewrite: { '^/api': '' },
      },
      '/lcd': {
        target: productionConfig?.lcdUrl ? productionConfig.lcdUrl:'http://192.168.150.40:1317',
        
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
