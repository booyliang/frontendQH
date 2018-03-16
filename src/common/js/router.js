import Yryz from '@/js/yryz'
import Env from '@/js/env'
import Router from "vue-router";
import Index from "@/views/index/routes";
import Redirect from "@/views/redirect/routes";
import QuestionRouter from "@/views/question/routes";
import VotingRouter from "@/views/voting-edit/routes";
import Activity from "@/views/activity/routes";
import Topic from "@/views/topic/routes";

import UserRouter from "@/views/user/routes";
import MemberRouter from '@/views/member/routes';
import Search from '@/views/search/routes';
import Hot from '@/views/hot/routes'; // hot组件内的路由
import Publish from '@/views/publish/routes'; // publish组件内的路由
import Product from '@/views/product/routes'; // publish组件内的路由
import Coterie from '@/views/coterie/routes/index'; 

// let re = /(.*)\/tab\/.*/gi;
import user from './user'; 
const merge = function () {
	return Array.prototype.concat.apply([], arguments);
};
function install(Vue, options) {
	let { circleRoutes } = options;
	let routes = merge(circleRoutes, Index, Redirect, QuestionRouter,  VotingRouter, Activity, Topic, MemberRouter, UserRouter, Search, Hot,
		Publish, Product, Coterie);
	if (process.env.NODE_ENV === 'development') {
		let componentsRouter = require("@/views/components/routes")
		// console.log(componentsRouter.default)
		routes = merge(routes, componentsRouter.default) 
	}
	Vue.use(Router);
	let router = new Router({
		routes,
		mode: "history",
		base: options.circleInfo.circleShortName,
		scrollBehavior(to, from, savedPosition) {
			//  防止多个页面keepalive导致滚动错乱
			if (savedPosition && from.matched[0] && !from.matched[0].meta.keepAlive) {
				return savedPosition
			} else {
				return { x: 0, y: 0 }
			}
		}
	});
	router.afterEach(route => {
		if (route.matched.length === 0) {
			// console.log('route', route);
			Vue.nextTick(() => {
				Vue.eventBus.$emit("global-message", {
					type: "not-found",
					action: app => app.currentView = "y-not-found"
				});
			});
		}
	});
	router.beforeEach((to, from, next) => {
		if (to) { 
			Env.coterieId = to.params.coterieId ? to.params.coterieId : ""; 
		}
			
		
		Vue.eventBus.$emit("global-message", {
			type: "reset",
			action: app => { if (app.currentView !== "router-view") app.currentView = "router-view" }
		});
		// 登录授权验证
		if (to.meta.authorization && !user.isLogin) {
			user.login().then(data => { 
				next();
			})
			return;
		}
		if (to.matched.length > 0) {
			return next();
		}
		let path = to.path;
		var tabIndex = path.lastIndexOf("/tab/");
		if (tabIndex === -1) return next();

		var parentPath = path.substr(0, tabIndex);
		var matched = router.matcher.match(parentPath).matched;
		let parentRoute = matched[matched.length - 1];
		let component = matched[matched.length - 1].components.default;
		let meta = matched[matched.length - 1].meta;
		let routePath = parentRoute.path + "/tab/:tabId";
		let tabRoute = {
			path: routePath.replace("//", "/"),
			component: component,
			meta

		};
		router.addRoutes([tabRoute]);
		router.replace({ path: to.path });
	});
	Vue.router = router;
	return router;
}
export default install;
