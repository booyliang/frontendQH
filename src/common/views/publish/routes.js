export default [
	{
		path: "/publish/list/classify/:classifyId",
		component: require("./index"),
		meta: { keepAlive: true }
	},
	{
		path: "/publish/list/classify/:classifyId/classifyItem/:classifyItemId",
		component: require("./index"),
		meta: { keepAlive: true }
	},
	{
		path: "/publish/list/classify/:classifyId/:classifyItemName/:classifyItemId",
		component: require("./list-style-a"),
		meta: { keepAlive: true }
	},
	{
		path: "/publish/list/classifyNew/:classifyId/:classifyItemName/:classifyItemId",
		component: require("./indexnew"),
		meta: { keepAlive: true }
	},
	{ path: "/publish/detail/:id", component: require("./detail") }
];
