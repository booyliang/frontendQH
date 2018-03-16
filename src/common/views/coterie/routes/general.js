import MyPurchase from '../purchase-list'
import GeneralDetail from '../general/details'
import Nodata from '../redirect/nodata'
import NoCoterie from '../redirect/no-coterie'

export default [{
	name: "coterieIndex",
	path: "",
	redirect: "all",
	component: require("../index"),
	// meta: { keepAlive: true },
	children: [
		{
			name: "all",
			path: "all",
			// meta: {keepAlive: true},
			component: require("../general")
		},
		{
			name: "prime",
			path: "prime",
			component: require("../general")
		},
		{
			name: "question",
			path: "question",
			component: require("../question")
		},
		{
			name: "topic",
			path: "topic",
			component: require("../topic")
		},
		{
			name: "activity",
			path: "activity",
			component: require("../activity")
		}
	]
},
{
	name: 'purchase-list',
	component: MyPurchase,
	path: "purchase-list"
},
{
	name: 'generalDetail',
	component: GeneralDetail,
	path: "general/details/:detailId"
},
{
	name: 'nodata',
	component: Nodata,
	path: "nodata"
},
{
	name: 'noCoterie',
	component: NoCoterie,
	path: "no-coterie"
}
]