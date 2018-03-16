import Vue from 'vue'
import Circle from '@/js/circle'
import circleRoutes from './router'
import './css/app.css';
let circleInfo = process.circleInfo;
let validateCircle = false;
let httpPrefix = '/activity';
async function install(Vue) {
	Circle.install(Vue, {circleInfo, circleRoutes, validateCircle, httpPrefix});
}
install(Vue)
