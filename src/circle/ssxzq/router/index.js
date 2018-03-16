import Excellent from './excellent' // 学校培优
const merge = function () {
	return Array.prototype.concat.apply([], arguments)
};
let routes = [
];
routes = merge(routes, Excellent)
export default routes

