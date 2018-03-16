export default [
	{
		path: '/user',		// 个人中心
		component: require('../views/user/index')
	},
	{
		path: '/user/bank-card',		// 银行卡
		component: require('../views/user/bank-card'),
		meta: {
			authorization: true
		}
	},
	{
		path: '/user/add-bank-card',		// 添加银行卡
		component: require('../views/user/add-bank-card')
	},
	{
		path: '/user/credit',		// 我的额度
		component: require('../views/user/credit'),
		meta: {
			authorization: true
		}
	},
	{
		path: '/user/repayment-list',  // 全部待还列表
		component: require('../views/user/repayment-list'),
		meta: {
			title: '全部待还'
		}
	},
	{
		path: '/user/wantpay-list', // 我要还款列表
		component: require('../views/user/wantpay-list'),
		meta: {
			title: '我要还款',
			authorization: true
		}
	},
	{
		path: '/user/repayment/:payType/:orderNo', // 还款计划、待还详情
		component: require('../views/user/repayment')
	},
	{
		path: '/user/repayment-log/detail/:id',		// 还款详情
		component: require('../views/user/repayment-detail')
	},
	{
		path: '/user/repayment-log',		// 还款记录
		component: require('../views/user/repayment-log'),
		meta: {
			title: '还款记录'
		}
	},
	{
		path: '/user/order/detail/:id',		// 订单詳情
		component: require('../views/user/order-detail')
	},
	{
		path: '/user/order',		// 我的订单
		component: require('../views/user/order'),
		meta: {
			authorization: true
		}
	},
	{
		path: '/user/goods-detail/:productId',		// 商品详情
		component: require('../views/user/goods-detail')
	},
	{
		path: '/user/profile',
		component: require('../views/auth'),
		meta: {
			title: '认证资料',
			context: 'user',
			authorization: true
		}
	},
	{
		path: '/user/contact',
		component: require('../views/user/contact')
	},
	{
		path: '/user/additional-profile',
		component: require('../views/user/additional-profile'),
		meta: {
			title: '补充征信资料',
			context: 'user',
			authorization: true
		}
	},
	{
		path: '/user/pay/:id',
		component: require('../views/user/pay')
	}
]