import Index from '../views/broadcast/index'
import Detail from '../views/broadcast/detail'
export default [
	{
		path: '/broadcast/index', // 每日播报首页
		component: Index
	},
	{
		path: '/broadcast/detail/:id', // 播报详情页
		component: Detail
	}
]
