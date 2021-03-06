import Vue from 'vue'
import Circle from '@/js/circle'
import circleRoutes from './router'
import circleResource from './config/resource_cn'
import circleModules from './config/modules'
import './css/app.css';
let circleInfo = process.circleInfo;
async function install(Vue) {
	Circle.install(Vue, {circleResource, circleInfo, circleModules, circleRoutes});
}
install(Vue)
