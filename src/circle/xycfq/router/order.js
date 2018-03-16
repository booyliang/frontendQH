export default [
	{
		path: '/order',
		component: require('../views/main.vue'),
		redirect: '/',
		children: [
			{
				// userType 1,学生; 2,社会群体
				path: 'preview/user-type/:userType',
				name: 'previewOrder',
				component: require('../views/order/preview.vue'),
				meta: {
					title: '签订合同'
				}
			},
			{
				path: 'detail-:orderId',
				name: 'orderDetail',
				component: require('../views/order/index.vue'),
				meta: {
					title: '订单详情'
				}
			},
			{
				path: 'service-charge/user-type/:userType/order-id/:orderId',
				name: 'orderServiceCharge',
				component: require('../views/order/service-charge.vue'),
				meta: {
					title: '赊销服务费'
				}
			},
			{
				path: 'trading/:orderId',
				component: require('../views/order/trading.vue'),
				meta: {
					title: '交易详情'
				}
			}
		]
	}
]