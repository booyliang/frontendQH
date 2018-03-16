import Horoscope from './horoscope'  // 星座运势
import Wish from './wish'  // 许愿祈福

const merge = function () {
	return Array.prototype.concat.apply([], arguments);
};
let routes = [];
routes = merge(routes, Horoscope, Wish);
export default routes

