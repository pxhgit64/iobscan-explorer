const path = require('path') //引入path模块
function resolve(dir) {
  return path.join(__dirname, dir) //path.join(__dirname)设置绝对路径
}

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target:'https://irishub.iobscan.io/api/',
        // target:'http://10.0.1.30:32030',
        // target:'http://10.0.4.4:32018',
        // target:'http://10.0.1.30:32030/',
        // target:'http://localhost:3000/',
        // target:'http://192.168.150.41:3001/',
        // target:'http://192.168.150.61:3002',//qaCosmos
        secure: false,
        pathRewrite: { '^/api': '' },
      },
      '/lcd': {
        // target: 'https://lcd.irishub-1.rainbow.one/',
        // target: 'http://192.168.150.61:51317',//qaCosmos
        // target: 'http://10.0.1.116:1317',
        target: 'http://192.168.150.40:1317',
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
