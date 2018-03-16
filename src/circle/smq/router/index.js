
import Attestation from './attestation' // 认证
import Expert from './expert' // 数码达人
import Unused from './unused' // 闲置

const merge = function () {
	return Array.prototype.concat.apply([], arguments);
};
let routes = [];

routes = merge(routes, Attestation, Expert, Unused);

export default routes;
