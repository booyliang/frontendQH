let fs = require('fs-extra');
let path = require('path');
let circles = require('../config/appConfig.js');

const CIRCLE_FOLDER_PATH = './src/circle';
const DEST_PATH = './config';
let childFolders = ['assets', 'config', 'css', 'router', 'views', 'main.js'];
const TEXT = "import Vue from 'vue';\nimport circleRoutes from './router';\nimport Circle from '@/js/circle';\nlet circleInfo = process.circleInfo;\nasync function install(Vue)\n{\n\tCircle.install(Vue, {circleInfo, circleRoutes});\n}\ninstall(Vue);";
const TEXT_ROUTER_INDEX = "const merge = function () {\n\treturn Array.prototype.concat.apply([], arguments)\n};\nlet routes = [];\nroutes = merge(routes);\nexport default routes";
const OLD_CIRCLE = ['yxwjq',
	'lytdq',
	'sjmwq',
	'sxxzq',
	'nxsyq',
	'lsq-o',
	'smq',
	'hlwq',
	'sytdq',
	'xycfq',
	'activity',
	'ydqtq',
	'swswq',
	'jsstq',
	'yswhq',
	'gczyq',
	'fakaq',
	'ssxzq',
	'hd']

function buildFolders(dir, arr) {
	arr.forEach(item => {
		let parentRoute = path.join(dir, item);
		mkdirsSync(parentRoute);
		let files = fs.readdirSync(dir);
		files.forEach(item => {
			childFolders.forEach(child => {
				let route = path.join(parentRoute, child);
				mkdirsSync(route);
				if (route.includes('router') && fs.readdirSync(route).length === 0) {
					fs.writeFileSync(`${route}/index.js`, TEXT_ROUTER_INDEX);
				}
			})
		});
	});
}
Array.prototype.diff = function (a) {
	return this.filter(function (i) { a.indexOf(i) < 0; });
}
function removeFolders(dir, arr) {
	var files = fs.readdirSync(dir);
	var targetFolders = files.diff(arr);
	for (var i; i < targetFolders.length; i++) {
		let route = path.join(dir, targetFolders[i]);
		console.log(files);
	};
}
function mkdirsSync(dirname, mode) {
	if (fs.existsSync(dirname)) {
		return true;
	} else {
		if (mkdirsSync(path.dirname(dirname), mode)) {
			if (/^\./.test(path.extname(dirname))) {
				fs.appendFileSync(dirname, TEXT);
			} else {
				fs.mkdirSync(dirname, mode);
			}
			return true;
		}
	}
}
function buildConfigData(destDir) {
	mkdirsSync(destDir);
	fs.writeFileSync(`${destDir}/output.js`, `module.exports=${JSON.stringify(getCircleData(circles))}`);
}
function getCircleData(sourceData){
	let fileStr = fs.readFileSync('build/config.txt', 'utf8');
	let temp = [], output = {};
	fileStr.split('\n').forEach(item => {
		temp.push(item.split('\t'));
	});
	temp.forEach((item, i) => {
		output[item[2]] = {
			appId: item[5],
			appSecret: item[6],
			circleName: item[1],
			code: "0" + (29 + i)
		};
	});
	return Object.assign(sourceData, output);
}
// buildConfigData(DEST_PATH);
// buildFolders(CIRCLE_FOLDER_PATH, Object.keys(getCircleData(circles)));
removeFolders(CIRCLE_FOLDER_PATH, OLD_CIRCLE);
