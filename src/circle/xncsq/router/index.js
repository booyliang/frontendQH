import Shop from './shop' // 精品铺子
import Snack from './snack' // 每日五小食
const merge = function () {
	return Array.prototype.concat.apply([], arguments)
};
let routes = [
];
routes = merge(routes, Shop, Snack);
export default routes
