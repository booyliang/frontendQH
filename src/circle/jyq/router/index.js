import Broadcast from './broadcast' // 每日播报
const merge = function () {
	return Array.prototype.concat.apply([], arguments)
};
let routes = [
];
routes = merge(routes, Broadcast)
export default routes

