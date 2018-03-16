export default {
	"1001": {
		name: "test",
		link: "/somewhere/:id"
	},
	'0021': {
		name: 'user',		
		link: '/user/:id',
		desc: '个人主页',
		addMenu: 'true',
		setHeadInfo: require('@/views/user/authentication'), // 个人主页 定制：悠然认证
	},
	'10153': {
		name: "jump",
		desc: '摄影认证',
		link: "/shoot/jump"
	},
	"10151": {
		name: "sell",
		link: "/sell/detail/:id",
		apiUrl: '/services/app/v1/business/list',
		desc: '商家详情'
	},
	"101502": {
		name: "works",
		apiUrl: '/services/app/v1/appreciation/list',
		link: "/works/detail/:id",
		desc: '优秀作品详情'
	}
};
