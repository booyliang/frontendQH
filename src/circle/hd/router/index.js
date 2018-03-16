import Activity from "./activity"; // 活动
import Log from "./log"; // 登录注册

const merge = function () {
	return Array.prototype.concat.apply([], arguments);
};
let routes = [];
routes = merge(routes, Activity, Log);
export default routes;
