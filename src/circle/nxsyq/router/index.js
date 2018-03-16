import Garden from './garden' // 秘密花园
import Goods from './goods' // 尤物
const merge = function () {
	return Array.prototype.concat.apply([], arguments)
};
let routes = [
];
routes = merge(routes, Garden, Goods);
export default routes
