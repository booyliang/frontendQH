
import Attestation from "./attestation"; // 认证
import Sell from "./sell"; // 商家优选
import Works from "./works";


const merge = function () {
	return Array.prototype.concat.apply([], arguments);
};
let routes = [];
routes = merge(routes, Attestation, Sell, Works);

export default routes
