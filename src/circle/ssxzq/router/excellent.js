import Index from '../views/excellent/index'
import schoolDetail from '../views/excellent/school'
import impressDetail from '../views/excellent/impress'
import New from "../views/excellent/edit";
export default [
	{
		path: '/excellent/index', // 学校培优首页
		component: Index
	},
	{
		path: '/excellent/school/:id', // 学校详情页
		component: schoolDetail
	},
	{
		path: '/excellent/impress/:id', // 印象（帖子）详情页
		component: impressDetail
	},
	{
		path: '/excellent/edit/:id', // 印象（帖子）发布页
		component: New
	}
]
