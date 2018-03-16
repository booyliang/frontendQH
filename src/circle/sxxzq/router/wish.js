import Wish from "../views/wish";
import mywish from "../views/wish/mywish";
import wishclassify from "../views/wish/wishclassify";
import wishnew from "../views/wish/wish-new";

export default [
	{
		path: "/wish", // 许愿祈福
		component: Wish
	},
	{
		path: "/mywish",
		component: mywish
	},
	{
		path: "/wishclassify/:id",
		component: wishclassify
	},
	{
		path: "/wishnew/:id",
		component: wishnew
	}
];
