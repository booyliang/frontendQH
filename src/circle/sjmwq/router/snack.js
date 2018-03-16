import Index from '../views/snack/index'
import Detail from '../views/snack/detail'
import SnackAll from '../views/snack/snack-all'
export default [
	{
		path: '/snack/index',
		component: Index
	},
	{
		path: '/snack/detail/:id',
		component: Detail
	},
	{
		path: '/snack/all',
		component: SnackAll
	}
]