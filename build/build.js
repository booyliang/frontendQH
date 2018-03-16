require('./check-versions')()
process.env.NODE_ENV = 'production'
var opn = require('opn')
var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var spinner = ora('building for production...')
var utils = require('./utils')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

function resolve(dir) {
	return path.join(__dirname, '..', dir)
}
spinner.start()
let circlePath = path.join(config.build.assetsRoot, utils.circleName)
// new HtmlWebpackPlugin(
let webpackConfig = require('./webpack.prod.conf');
let htmlWebpackOption = {
	filename: path.resolve(__dirname, '../dist/' + utils.circleName + '/index.html'),
	template: 'index.html',
	inject: true,
	backgroudUrl:utils.getBackgroudUrl(),
	minify: {
		removeComments: true,
		collapseWhitespace: true,
		removeAttributeQuotes: true
	},
	chunksSortMode: 'dependency'
}

function build() {
	spinner.text = 'building common ';
	let common = require('./common');
	common.build(() => {
		webpackConfig.plugins.push(new webpack.DllReferencePlugin({
			sourceType: 'var',
			manifest: require(`../dist/${utils.circleName}/common_manifest.json`),
		}))
		webpackConfig.plugins.push(new webpack.DllReferencePlugin({		
				sourceType: 'var',
				manifest: require("../dist/assets/js/vendor_manifest.json"),
			}));
		htmlWebpackOption.commonJs = utils.getCommonJs();
		htmlWebpackOption.commonCss = utils.getCommonCss();
		htmlWebpackOption.vendorJs = utils.getVendorJs();
		let arg3 = process.argv[3];
		console.log('arg3', arg3)
		if (arg3 === 'mo') {
			htmlWebpackOption.preconnect = 'https://circle-mo.yryz.com';
		} else if (arg3 === 'm') {
			htmlWebpackOption.preconnect = 'https://circle.yryz.com';
		} else { 
			htmlWebpackOption.preconnect = 'http://circle-dev.yryz.com';
		}
		// htmlWebpackOption.preconnect
		let commonJsName = utils.getFileName(`dist/${utils.circleName}/assets/js`, /^common\..*\.js$/);
		let commonJsHash = commonJsName.split('.')[1];
		webpackConfig.output.filename = `[name].${commonJsHash}.[hash:8].js`,
			buildCircle();
	})


}

function buildCircle() {
	spinner.text = 'building circle ';
	
	let plugins = [
		new CopyWebpackPlugin([
		{
				from: path.resolve(__dirname, '../dist/assets/js'),
				to: './assets/js',
				ignore: ['.*', '*.json']
			},
			{
				from: path.resolve(__dirname, '../src/common/assets/static'),
				to: '../assets/static',
				ignore: ['.*', '*.json']
			},
			{
				from: path.resolve(__dirname, `../dist/${utils.circleName}/assets`),
				to: '../assets',
				ignore: ['.*', '*.json']
			},
			{
				from: path.resolve(__dirname, '../src/common/assets/static'),
				to: './assets/static',
				ignore: ['.*', '*.json']
			}
		], {
			copyUnmodified: true
		}),
		new HtmlWebpackPlugin(htmlWebpackOption)
		

	]

	webpackConfig = require('webpack-merge')(webpackConfig, {
		plugins
	})

	// console.log('webpackConfig', webpackConfig)
	webpack(webpackConfig, function (err, stats) {
		spinner.stop()
		if (err) throw err
		process.stdout.write(stats.toString({
			colors: true,
			modules: false,
			children: false,
			chunks: false,
			chunkModules: false
		}) + '\n\n')

		console.log(chalk.cyan('Build complete.\n'))

	})
}
rm(circlePath, (err, stats) => {
	if (err) throw err
	utils.buildVendor(build)	
	// buildCircle();
});