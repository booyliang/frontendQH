import Index from '../views/mine/index'
import SetName from '../views/mine/set-name'
import SetGender from '../views/mine/set-gender'
import SetIntro from '../views/mine/set-intro'
export default [
	{
		path: '/mine/index',
		component: Index,
		meta: {
			authorization: true
		}
	},
	{
		path: '/mine/set-name',
		component: SetName
	},
	{
		path: '/mine/set-gender',
		component: SetGender
	},
	{
		path: '/mine/set-intro',
		component: SetIntro
	}
]