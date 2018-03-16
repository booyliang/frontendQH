export default {
	"1001": {
		name: "test",
		link: "/somewhere/:id"
	},
	"0021": {
		name: "user",
		link: "/user/:id",
		desc: "个人主页",
		coverItem: require("@/views/user/good-at"),
		coverApiUrl: "/services/app/v1/lawyer/authentication/singleInfoMain"
	},
	"10121": {
		name: "lawyer",
		link: "/lawyer/detail/:id",
		desc: '律师认证'
	},
	"10122": {
		name: "office",
		link: "/office/detail/:id",
		desc: '律所认证'
	},
	"10123": {
		name: "viewpoints",
		link: "/viewpoints/list",
		desc: '名家说法'
	},
	"10124": {
		link: "/viewpoints/detail/:id",
		desc: '名家说法详情'
	}
};
