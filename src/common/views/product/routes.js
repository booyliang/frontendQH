export default [
	{
		path: "/product",
		component: require("./index")
	},
	{
		path: "/product/detail/:id",
		component: require("./detail")
	},
	{
		path: "/product/edit",
		component: require("./edit")
	},
	{
		path: "/product/edit-city",
		component: require("./edit-city")
	},
	{
		path: "/product/edit-fineness",
		component: require("./edit-fineness")
	},
	{
		path: "/product/edit-category",
		component: require("./edit-category")
	}
];
