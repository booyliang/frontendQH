import Index from '../views/garden/index'
import Detail from '../views/garden/detail'
import NewGarden from '../views/garden/new'
export default [
	{
		path: '/garden/index',
		component: Index
	},
	{
		path: '/garden/detail/:id',
		component: Detail
	},
	{
		path: '/garden/new',
		component: NewGarden
	}
]