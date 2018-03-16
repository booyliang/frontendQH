import Vue from 'vue'
import Circle from '@/js/circle'
import circleRoutes from './router'
import circleResource from './config/resource_cn'
import circleModules from './config/modules'
import './css/app.css';
let circleInfo = process.circleInfo;
let baseUrls = {
	'dev': 'http://circle-dev.haidao86.com',
	'mo': 'https://b-mo.yryz.com',
	'web': 'https://circle.haidao86.com',
	'test': 'http://circle-test.haidao86.com'
};
async function install(Vue) {
	Circle.install(Vue, {circleResource, circleInfo, circleModules, circleRoutes, baseUrls});
}
install(Vue)
