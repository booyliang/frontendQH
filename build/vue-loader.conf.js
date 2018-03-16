var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'
let cssLoader = utils.cssLoaders({
	sourceMap: isProduction
		? config.build.productionSourceMap
		: config.dev.cssSourceMap,
	extract: isProduction
});
// if (isProduction) { 
// cssLoader.js = 'happypack/loader?id=babel'
// cssLoader.css = 'happypack/loader?id=css'
// cssLoader.postcss= 'happypack/loader?id=css'	
// }

module.exports = {
  loaders: cssLoader
}
