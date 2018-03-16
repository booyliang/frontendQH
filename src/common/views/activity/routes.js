export default [
	{ path: "/activity", component: require("./index"), meta: { keepAlive: true } },
	{ path: "/activity/new", component: require("./activity-new-singup") },   // 发布活动  报名类
	{ path: "/activity/circle", component: require("./private-circle") },   // 关联私圈
	{ path: "/activity/address", component: require("./address-enter") },   // 关联私圈
	{ path: "/activity/homepage/:id", component: require("./homepage") },	// 活动主页
	{ path: "/activity/new/:id", component: require("./new") }, // 参与活动(报名)
	{ path: "/activity/vote/new/:id/:cateId", component: require("./vote-new") },	// 参与活动(投票)
	{ path: "/activity/detail/:id/:detailId", component: require("./detail") }, // 详情页面
	{ path: "/activity/participants/:id", component: require("./participants") } // 参与人员
];
