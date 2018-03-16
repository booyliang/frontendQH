export default [{
	path: "/user/:id",
	component: require("./index"),
	children: [{
		path: "",
		component: require("./user-content"),
	},
	{
		path: "cate/:cateId",
		component: require("./user-content"),
	},
	{
		name: 'user-module',
		path: "cate/:cateId/module/:moduleEnum",		
		component: require("./user-content"),
	
	},
	{
		name: 'user-module-classify',
		path: "cate/:cateId/module/:moduleEnum/classify/:classifyId",		
		component: require("./user-content"),
	
	},
	{
		name: 'user-module-classify-classifyItem',
		path: "cate/:cateId/module/:moduleEnum/classify/:classifyId/classifyItem/:classifyItemId",		
		component: require("./user-content"),
	
	}
	]
}];
