import Attestation from "./attestation"; // 认证
import viewpoints from "./viewpoints"; // 名家说法

const merge = function () {
	return Array.prototype.concat.apply([], arguments);
};
let routes = [];
routes = merge(routes, Attestation, viewpoints);
export default routes;
