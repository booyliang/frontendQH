export default [
	{
		path: "/search", // 搜索主页
		component: require("./index"),
		children: [
			{
				name: "search-result",
				meta: { keepAlive: true },
				path: "result",
				component: require("./result")
			}
		]
	}
];
