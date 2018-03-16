export default {
	"10141": {
		name: "broadcastDetail",
		link: "/broadcast/detail/:id",
		desc: '每日播报详情页',
		share(data) {
			let content = data.contentIncident.substring(0, 75);
			return { content }
		}
	},
	"10142": {
		name: "broadcast",
		link: "/broadcast/index",
		apiUrl: '/services/app/v1/broadcast/info/list',
		desc: '每日播报'
	}
}
