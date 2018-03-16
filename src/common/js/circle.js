import viewport from "./viewport";
import utils from "./utils";
import EventBus from "./event-bus";
import yryz from "./yryz";
import LocalStore from "./localStore";
import filter from "../filters";
import polyfile from "./polyfile";
import Components from "./components";
import Http from "./http";
import Resource from "./resource";
import Router from "./router";
import OpenApiHttp from "@/js/openapi-http";
import Toast from "../components/toast/toast";
import App from '@/views/App'
import Cache from "./cache";
import Env, {install as  envInstall} from "./env";
import fixBack from "./fix-back-not-render";
import User from "./user";
import coterie from "../views/coterie/js/coterie";
let circle = {};
circle.install = async function (Vue, options) {

	Object.assign(circle, options.circleInfo)
	if (!circle.circleName && options.validateCircle !== false)
		console.error('appconfig中必须配置circleName')
	Vue.prototype.$circle = Vue.circle = circle;
	Vue.prototype.$circleOptions = Vue.circleOptions = options;

	for (let name in filter) {
		Vue.filter(name, filter[name]);
	}
	Vue.use(coterie)
	Vue.use(EventBus, options);	
	await envInstall(Vue, options)
	Vue.use(yryz);
	Vue.use(utils, options);
	Vue.use(Http, options);

	Vue.use(OpenApiHttp);
	Vue.use(LocalStore);
	
	Vue.use(Resource, options);
	
	Vue.use(Components);	
	Vue.use(fixBack);
	Vue.use(Cache);
	Vue.use(User, options);
	window.handleError = true;
	Vue.config.productionTip = false;	
	viewport(Vue);
	let router = Router(Vue, options)
	// 非正式环境全局弹出错误
	if (window.location.href.indexOf('web.') === -1 && window.location.href.indexOf('m.') === -1) {
		Vue.config.errorHandler = function (err, vm, info) {
			// let msg = typeof err === 'string' ? err : JSON.stringify(err)
			Toast(err.toString() + (info || '').toString());
			throw err
		}
	}	
	
	let vueInst =  new Vue({
		el: '#app',
		router,
		template: '<app/>',
		components: { App }
	});
	return vueInst;

}

export default circle;
