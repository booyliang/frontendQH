import resource_cn from '@/config/resource_cn';
let resource = resource_cn;
const pattern = /\{[0-9]\}/g;
function getResource(key, ...params) {
	let str = resource[key];
	if (typeof str === 'undefined') {
		console.error('没找到相应资源', key);
		return ''
	}
	if (params.length > 0)
		return str.replace(pattern, (match) => {
			let index = parseInt(match[1])
			return params[index]
		});

	return str;
}

function install(Vue, options) {
	let  {circleResource} = options;
	resource = Object.assign(resource, circleResource)
	Vue.prototype.$R = Vue.R = getResource;
}
export default install

