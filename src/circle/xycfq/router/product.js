export default [
	{
		path: '/product',
		component: require('../views/main.vue'),
		children: [
			{
				path: 'list/user-type/:userType',
				name: 'product-list',
				component: require('../views/product/list'),
				meta: {
					title: '选择赊销商品'
				}
			},
			{
				path: 'goods-view',
				component: require('../views/product/goods-view'),
				meta: {
					title: '赊销商品库'
				}
			},
		]
	},
	{
		path: '/product/detail/:id',
		name: 'product-detail',
		component: require('../views/product/detail'),
		meta: {
			title: '商品详情'
		}
	}
]