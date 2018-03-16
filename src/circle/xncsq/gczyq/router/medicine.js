import Index from "../views/medicine/index";
import Celebritylist from "../views/medicine/celebritylist";
export default [
	{
		path: "/medicine/index/:classifyId", // 名医首页
		component: Index
	},
	{
		path: "/medicine/celebritylist", // 名医列表
		component: Celebritylist
	}
];
