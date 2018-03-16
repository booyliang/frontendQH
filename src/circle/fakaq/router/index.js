import Medical from './medical'    // 名医名院

const merge = function () {
	return Array.prototype.concat.apply([], arguments);
};

let routes = [];
routes = merge(routes, Medical);

export default routes;
