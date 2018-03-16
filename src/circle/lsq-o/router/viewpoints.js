import viewpointsIndex from "../views/viewpoints/index";
import viewpointsMain from "../views/viewpoints/main";
import viewpointsDetail from "../views/viewpoints/detail";

export default [
	{
		path: "/viewpoints/list",
		component: viewpointsIndex
	},
	{
		path: "/viewpoints/main/:id",
		component: viewpointsMain
	},
	{
		path: "/viewpoints/detail/:id",
		component: viewpointsDetail
	}
];
