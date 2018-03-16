import User from "./user";
import Order from "./order";
import Address from "./address";
import Product from "./product";
import circleResource from "../config/resource_cn";
import Xyjd from "./xyjd";
import Auth from "../views/auth";
import Mine from "./mine";
import Message from './message';

const merge = function () {
	return Array.prototype.concat.apply([], arguments);
};

let routes = [
	{
		path: "/",
		component: require("../views/index")
	},
	{
		path: "/report",
		component: require("../views/report")
	},
	{
		path: "/trade-success",
		component: require("../views/trade-success"),
		meta: { disableForward: true }
	},
	{
		path: "/trade-complete/:orderId",
		name: "trade-complete",
		component: require("../views/trade-complete")
	},
	{
		path: "/xyjd/looking-forward",
		name: "looking-forward",
		component: require("../views/xyjd/looking-forward")
	},
	{
		path: "/xysx",
		component: require("../views/main"),
		redirect: "/xysx/index",
		children: [
			{
				path: "index",
				component: require("../views/xysx/index"),
				meta: {
					title: "信用赊销",
					userType: 2
				}
			},
			{
				path: "contract",
				component: require("../views/xysx/contract"),
				meta: {
					title: "合同预览"
				}
			}
		]
	},
	{
		name: "xysx-auth",
		path: "/xysx/apply",
		component: Auth,
		meta: {
			type: "xysx",
			context: "xysx",
			title: "信用认证"
		}
	},
	{
		path: "/xyzx",
		component: require("../views/main"),
		redirect: "/xyzx/index",
		children: [
			{
				path: "index",
				component: require("../views/xyzx/index"),
				meta: {
					title: circleResource["xyzx-title"],
					userType: 1
				}
			},
			{
				path: "contract",
				component: require("../views/xyzx/contract"),
				meta: {
					title: "合同预览"
				}
			}
		]
	},
	{
		name: "xyzx-auth",
		path: "/xyzx/apply",
		component: Auth,
		meta: {
			type: "xyzx",
			context: "xyzx",
			title: "信用认证"
		}
	},
	{
		name: "mobile-binding",
		path: "/mobile-binding",
		component: require("../views/mobile-binding")
	}
];

routes = merge(routes, User, Order, Address, Product, Xyjd, Message, Mine);

export default routes;
