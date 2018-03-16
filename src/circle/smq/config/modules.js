export default {
	"1001": {
		name: "test",
		link: "/somewhere/:id"
	},
	'0021': {
		name: 'user',		
		link: '/user/:id',
		desc: '个人主页',
		coverItem: require('@/views/user/good-at'),
		coverApiUrl: "/services/app/v1/digital/authentication/singleInfoMain"
	},
	"10133": {
		name: "unused",
		link: "/unused/detail/:id",
		apiUrl: '/services/app/v1/idlemarket/list',
		desc: "闲置",
		listItem: require("../views/components/flow-item-unuse")
	},
	"10134": {
		name: 'expert',
		link: '/expert/inspect/:id',
		desc: "数码达人"
	},
	"10135": {
		name: "information",
		link: "/expert/information",
		desc: "资讯",
		listItem: require("../views/components/flow-item-information")
	},
};
