import env from "@/js/env";
import http from "@/js/http";
import eventBus from "@/js/event-bus";
let permissions = {}
let coterie = {
	permission: null,
	coterieId: "", // ro5nqd9oy3s6
	consultingFee: "",
	icon: "",
	createDate: "",
	custIcon: "",
	intro: "",
	joinCheck: "",
	joinFee: "",
	memberNum: null,
	name: "",
	newMemberNum: "",
	ownerId: "",
	ownerIntro: "",
	ownerName: "",
	qrUrl: "",
	status: "",
	async getPermission(coterieId, custId) {
		let url = `/services/app/v1/coterie/member/permission?coterieId=${coterieId}&custId=${custId}`;
		// if (permissions[url]) { 
		// 	this.permission = permissions[url];
		// 	return this.permission;	
		// }
		let res = await http.get(url);
		this.permission = res.data.data;
		// permissions[url] = res.data.data;	
		return this.permission;
	},
	async getCoterieInfo(coterieId) {
		let url = `/services/app/v1/coterie/info/single/${coterieId}`;
		let res = await http.get(url);
		if (res.data && res.data.data && parseInt(res.data.data.coterieStatus) === 4) {
			eventBus.$emit("global-message", {
				type: "removed",
				action: app => app.currentView = "y-removed-coterie"
			});
			throw '私圈下架';
		}
		Object.assign(coterie, res.data.data);
	},
	async init(currentRoute) {
		if (!env.coterieId) return;
		let coterieId = this.coterieId;
		coterieId = currentRoute.params.coterieId;
		await this.getCoterieInfo(coterieId);
		let custId = env.custId;
		if (!custId) return;
		await this.getPermission(coterieId, custId);
		// if (coterieId === currentRoute.params.coterieId)
			// return;
		// if (!currentRoute.params.coterieId) return;
	},
	install(Vue) {
		Vue.coterie = Vue.prototype.$coterie = coterie;
	}
};

export default coterie;