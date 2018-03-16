export default [
	{
		path: '/address',
		component: require('../views/main.vue'),
		redirect: '/address/index',
		children: [
			{
				path: 'index',
				component: require('../views/address/index.vue'),
				meta: {
					title: '收货人信息'
				}
			},
			{
				path: 'new',
				component: require('../views/address/edit.vue'),
				meta: {
					title: '新增收货人信息'
				}
			},
			{
				path: 'edit/:id',
				component: require('../views/address/edit.vue'),
				name: 'address-edit',
				meta: {
					title: '修改收货人信息'
				}
			}
		]
	}
]