import yryz from './yryz'
import eventBus from './event-bus'
import Toast from '@/components/toast'

async function setEnv(Vue, options) {
	let env = { coterieId: '', userId: '', custId: '', devType: '3' };
	env.tenantId = options.circleInfo.appId;
	try {
		if (yryz.isNative()) {
			let data = await yryz.httpHeader(null, 3000);
			Object.assign(env, data);
		} else if (options.circleInfo.NODE_ENV === "development") {
			let defaultEnv = {
				sign: "ceshi", // 未知
				token: "", // 接口访问凭证  4qqcxnbnht-HylFlWw9kRNY1510881250162   qqcxnbnht-YPfxvX07pxng1513834927650
				appVersion: "3.0.0", // APP版本
				v: "1.0", // 未知
				devType: "1", // 1： IOS，2：安卓
				devName: "IOS", // 设备名称
				devId: "123456578", // 当前访问设备id
				ip: "127.0.0.1", // 当前网络ip
				net: "wift", // 网络环境
				custId: "", // 765npt1huu 0u66cgvpvk 8qjl93ryu3  0m8xwqgrxd  r3l7bbgi 7onb1acsux 2mladd0xal 4qqcxnbnht
				userId: '', // 66
				coterieId: "",   // 测试数据 y993kg5o9kd2
				cityCode: "",
				gps: ""
			};
			Object.assign(env, defaultEnv)
		}

	} catch (ex) {
		// yryz.isNative() && Toast('无法获取原生环境')
	}
	if (!yryz.isNative()) env.devType = '3';
	for (let key in env) {
		eventBus.$set(eventBus.env, key, env[key])
	}
	return eventBus.env;
}
export async function install(Vue, options) {
	let env = await setEnv(Vue, options);
	Vue.prototype.$env = Vue.env = env;
	return eventBus.env;
}

export default eventBus.env;