export default [
	{
		path: '/works/index',
		component: require('../views/works/index')
	},
	{
		path: '/works/detail/:id',
		component: require('../views/works/detail')
	},
	{
		path: '/works/new',
		component: require('../views/works/new')
	},
	{
		path: '/works/selection',
		component: require('../views/works/selection')
	}
]