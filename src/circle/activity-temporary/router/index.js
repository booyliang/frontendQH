import blankRouterView from '../views/blank-router-view'
import IndexBlank from '../views/indexBlank'
import Index from '../views/index'
import Introduce from '../views/introduce'
import Rank from '../views/rank'
import Detail from '../views/detail'
import Join from '../views/join'
import Notice from '../views/notice'
import ShareDetail from '../views/share-detail'
let routes = [
	{
		path: '/',
		component: blankRouterView,
		redirect: {name: 'index'},
		meta: {
			disableForward: true,
		},
		children: [
			{ 
				path: "", 
				component: IndexBlank,
				redirect: {name: 'index'},
				meta: {
					disableForward: true,
				},
				children: [
					{
						path: 'index',
						name: 'index',
						meta: {
							disableForward: true,
							keepAlive: true
						},
						component: Index
					},
					{
						path: 'introduce',
						component: Introduce,
						name: 'introduce',
						meta: {
							disableForward: true,
							keepAlive: true
						},
					},
					{
						path: 'rank',
						component: Rank,
						name: 'rank',
						meta: {
							disableForward: true,
							keepAlive: true
						}
					},
					{
						path: 'notice',
						component: Notice,
						name: 'notice',
						meta: {
							disableForward: true,
							keepAlive: true
						}
					}
				]
			},
			{
				path: '/detail/:id',
				name: 'detail',
				component: Detail,
				meta: {
					disableForward: true,
				},
			},
			{
				path: '/share-detail/:id',
				name: 'shareDetail',
				component: ShareDetail,
				meta: {
					disableForward: true,
				},
			},
			{
				path: '/join',
				component: Join,
				meta: {
					disableForward: true,
				},
			}
		]
	}
];
routes = Array.prototype.concat.apply(routes);
export default routes;
