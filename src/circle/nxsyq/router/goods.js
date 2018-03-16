export default [{
	path: '/goods/index',
	component: require('../views/goods/index')
}, {
	path: '/goods/list', // 专题列表页
	component: require('../views/goods/list')
}, {
	path: '/goods/home/:id',
	component: require('../views/goods/home')
}, {
	path: '/goods/detail/:id',
	component: require('../views/goods/detail')
}, {
	path: '/goods/new/:id',
	component: require('../views/goods/new')
}]
