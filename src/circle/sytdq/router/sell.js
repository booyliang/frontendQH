export default [
	{
		path: '/sell/index',  // 商家优选
		component: require('../views/sell/index')
	},
	{
		path: '/sell/detail/:id',  // 商家详情
		component: require('../views/sell/detail')
	},
	{
		path: '/sell/mysell',  // 我的商家
		component: require('../views/sell/mysell')
	},
	{
		path: '/sell/new/:status',  // 发布商家
		component: require('../views/sell/new')
	}
]
