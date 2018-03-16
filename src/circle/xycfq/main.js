import Vue from 'vue'
import Circle from '@/js/circle'
import circleRoutes from './router'
import circleResource from './config/resource_cn'
import circleModules from './config/modules'
import './css/app.css';
let circleInfo = process.circleInfo;
let baseUrls = {
	'dev': 'http://circle-dev.haidao86.com',
	'mo': 'https://circle-mo.haidao86.com',
	'web': 'https://circle.haidao86.com',
	'test': 'http://circle-test.haidao86.com'
};
import Link from './components/link'
async function install(Vue) {
	await Circle.install(Vue, {circleResource, circleInfo, circleModules, circleRoutes, baseUrls});
	Vue.component('y-link', Link);
}

install(Vue)
