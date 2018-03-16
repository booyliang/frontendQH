import Index from "../views/unused/index";
import Detail from "../views/unused/detail";
import New from "../views/unused/edit";
import City from "../views/unused/edit-city";
import Category from "../views/unused/edit-category";
import Fineness from "../views/unused/edit-fineness";
export default [
	{
		path: "/unused/index",
		component: Index
	},
	{
		path: "/unused/detail/:id",
		component: Detail
	},
	{
		path: "/unused/edit",
		component: New
	},
	{
		path: "/unused/edit-city",
		component: City
	},
	{
		path: "/unused/edit-category",
		component: Category
	},
	{
		path: "/unused/edit-fineness",
		component: Fineness
	}
];
