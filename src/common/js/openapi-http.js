import axios from 'axios';
import qs from 'qs'
import Toast from '@/components/toast'
import yryz from './yryz'
function install(Vue) {
	let baseUrls = {
		'dev': 'http://api-dev.quanhu365.com',
		'mo': 'https://api-mo.quanhu365.com',
		'm': 'https://api.quanhu365.com',
		'test': 'https://api-test.quanhu365.com',
		'localhost': 'http://api-dev.quanhu365.com',
	};
	let baseUrl = '';
	let href = yryz.isNative() ? window.location.href : window.location.host;
	let match = href.match(/([A-Za-z]+)?\./)

	if (match && match.length > 1) {
		baseUrl = baseUrls[match[1].toLowerCase()];
		baseUrl = baseUrl || baseUrls['m'] // 找不到环境信息则跳到线上环境
		console.log('mmm:', baseUrl);
	} else {
		baseUrl = baseUrls['localhost'] || '';
	}
	if (baseUrl)
		baseUrl += ':' + window.location.port;
	axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
	Vue.openApi = Vue.prototype.$openApi = axios.create({ timeout: 20000 });
	Vue.openApi.interceptors.request.use(function (config) {
		config.data = qs.stringify(config.data)
		if (!config.url) {
			console.log('services请求地址出错', this, config)
		}
		if (config.url.indexOf('http') !== 0) {
			config.url = baseUrl + config.url;
			for (let key in Vue.env) {
				if (key === 'appversion' || key === 'devid' || key === 'devname' || key === 'devType' || key === 'ip' || key === 'net' || key === 'sign' || key === 'token' || key === 'v') {
					config.headers.common[key] = Vue.env[key];
				};
			}
		}

		config.headers.common['appId'] = 'vebff12m1762'
		// config.headers.common['token'] = 'EDB4urYY1504508183236'

		return config;
	});

	Vue.openApi.interceptors.response.use(function (res) {
		if (res.data && res.data.data && parseInt(res.data.data.shelveFlag) === 1) {
			Vue.nextTick(() => {
				Vue.eventBus.$emit("global-message", { type: 'removed', action: app => app.currentView = "y-removed" });
			})
		}
		if (res.data.ret === "4") {
			Toast(res.data.msg)
			yryz.kickOut(); // 用户被踢下线		
			return Promise.reject(res);
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