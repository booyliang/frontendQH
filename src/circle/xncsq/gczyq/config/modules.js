export default {
	'0021': {
		name: 'user',
		link: '/user/:id',
		desc: '个人主页',
		addMenu: 'true',
		setHeadInfo: require('../views/components/user-auth'), // 个人主页 定制：悠然认证
	},
	'10021': {
		name: "jump",
		desc: '中医认证',
		link: "/shoot/jump/:id"
	},
};
