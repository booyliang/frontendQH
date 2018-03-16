require('./check-versions')()
var path = require('path')

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
var fs = require('fs');
var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var utils = require('./utils')
// default port where dev server listens for incoming traffic
let port= process.argv[3]|| config.dev.port;

// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})
let appName=process.argv[2];
let proxys = utils.circleInfo.proxyTable || proxyTable
// console.log('utils.circleInfo', utils.circleInfo)
// proxy api requests
for(let context in proxys){
var options = proxys[context]
  if (typeof options === 'string') {
    options = {
      target: options,
      logLevel:'debug',
      changeOrigin: true,
		// headers:{Origin:'http://m-dev.yryz.com'},

      // onProxyReq:function(proxyReq, req, res) {
      //     // add custom header to request
      //     proxyReq.setHeader('x-added', 'foobar');
      //     // or log the req
      // }
    }
    // options.target=options.target+":"+port
    // options.target=options.target+'/app'
  }
  let proxyPath = context;
  if(proxyPath==='/services')
  	proxyPath = '/circle/services'
  app.use(proxyMiddleware(proxyPath , options))
}

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

var appConfig=require('../config/appConfig')
for (var appId in appConfig){
  app.get('/'+appId,function (req,res) {
 //   res.redirect('../')
  })

}
// serve pure static assets

var staticPath = path.join(__dirname, '..','src','circle', appName,'static')
if (fs.existsSync(staticPath)) {
	app.use('/' + appName + '/static', express.static(staticPath))
}
app.use('/assets', express.static(path.join(__dirname, '..','src','common','assets')))
app.use('/assets/js', express.static(path.join(__dirname, '..','dist','assets','js')))
var uri = 'http://localhost:' + port+'/'+appName+'/'
devMiddleware.waitUntilValid(function () {
  console.log('> Listening at ' + uri + '\n')
})

app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }

  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})

module.exports = app
