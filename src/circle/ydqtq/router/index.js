import Expert from './expert' // 运动达人
const merge = function () {
	return Array.prototype.concat.apply([], arguments)
};
let routes = [
];
routes = merge(routes, Expert)
export default routes

