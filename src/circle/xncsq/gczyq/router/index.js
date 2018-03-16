import Medicine from "./medicine"; // 新老名医
import Attestation from "./attestation"; // 认证
const merge = function () {
	return Array.prototype.concat.apply([], arguments);
};
let routes = [];
routes = merge(routes, Medicine, Attestation);
export default routes;
