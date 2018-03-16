import axios from 'axios';
import qs from 'qs'
import Toast from '@/components/toast'
import env from './env'
import yryz from './yryz';
let headers = ['sign', 'token', 'appVersion', 'v', 'devType', 'devName', 'devId', 'ip', 'net', 'custId'];

function install(Vue) {
	let baseUrls = {
		'dev': 'http://opusapi-dev.quanhu365.com',
		'mo': 'https://opusapi-mo.quanhu365.com',
		'opus': 'https://opusapi.quanhu365.com',
		'test': 'http://opusapi-test.quanhu365.com',
		'localhost': 'http://opusapi-dev.quanhu365.com'
	};
	let baseUrl = '';
	let href = yryz.isNative() ? window.location.href : window.location.host;
	let match = href.match(/([A-Za-z]+)?\./)
	let port = window.location.port;
	if (match && match.length > 1) {
		baseUrl = baseUrls[match[1].toLowerCase()];
		baseUrl = baseUrl || baseUrls['opus'] // 找不到环境信息则跳到线上环境
	} else {
		baseUrl = baseUrls['localhost'] || '';
	}
	baseUrl += ':' + port;
	console.log('baseUrl', baseUrl)

	let axiosInst = axios.create({ timeout: 20000 });
	Vue.opusApi = Vue.prototype.$opusApi = axiosInst;
	axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
	Vue.opusApi.interceptors.request.use(function (config) {
		// console.log('config', config.data)
		// let data = JSON.parse(config.data)
		config.data = qs.stringify(config.data)
		if (!config.url) {
			console.log('services请求地址出错', this, config)
		}
		if (config.url.indexOf('http') !== 0) {
			config.url = baseUrl + config.url;
			headers.map((key) => {
				if (Vue.env[key] !== undefined)
					config.headers.common[key] = Vue.env[key];
			})
		}
		// let testUrl = config.url.replace('yyl', 'app-operate');
		// config = Object.assign(config, { url: testUrl })
		// console.log('config', config)
		return config;
	});

	Vue.opusApi.interceptors.response.use(function (res) {
		// 重新登录
		if (res.data.ret === '4' || res.data.msg === '请重新登录') {
			Vue.eventBus.$emit('login')
		}
		if (res.data && res.data.data && parseInt(res.data.data.shelveFlag) === 1) {
			// if (res.data.data.id === 144) {
			Vue.nextTick(() => {
				Vue.eventBus.$emit("global-message", { type: 'removed', action: app => app.currentView = "y-removed" });
			})
		}
		return res;
	}, function (error) {
		if (error.message.indexOf('timeout') > -1) {
			Toast('操作超时！')
		}
		if (error.message.indexOf("Network Error") > -1) {
			if (yryz.isNative())
				Toast("当前网络不可用，请检查网络设置");
		}
		return Promise.reject(error);
	});
}

export default install;