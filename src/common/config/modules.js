import YFlowItemQestion from "@/views/question/components/flow-item-question";
export default {
	"0011": {
		name: "question",
		// listItem: YFlowItemQestion,
		link: "/question/detail/:id",
		desc: "问题一对多",
		apiUrl: "/services/app/v1/question/list/2", // flow-list请求接口地址
		heat: ["view", "answer"]
	},
	"0012": {
		name: "answerDetail",
		link: "/answer/detail/:id",
		desc: "答案一对多",
		apiUrl: "/services/app/v1/answer/list/2",
		share(data) {
			let title = this.$R("rz-yryz") + data.questionTitle.substring(0, 20);
			return { title };
		}
	},
	"0013": {
		name: "questionSingleDetail",
		link: "/question-single/detail/question/:id",
		desc: " 问题一对一",
		apiUrl: "/services/app/v1/question/list/1"
	},
	"0014": {
		name: "answerSingleDetail",
		link: "/question-single/detail/answer/:id",
		desc: "答案一对一",
		apiUrl: "/services/app/v1/answer/list/1"
	},
	"0021": {
		name: "user",
		link: "/user/:id",
		desc: "个人主页"
	},
	"0031": {
		desc: "投票"
	},
	"0041": {
		name: "topic",
		apiUrl: "/services/app/v1/topic/list",
		listItem: require("@/views/topic/flow-item-topic"),
		link: "/topic/home/:id",
		desc: "话题广场"
	},
	"0042": {
		name: "topicHome",
		apiUrl: "/services/app/v1/post/list",
		link: "/topic/detail/:id",
		desc: "话题主页",
		share(data) {
			let title = this.$R("rz-yryz") + data.topicTitle.substring(0, 20);
			return { title };
		}
	},
	"0051": {
		desc: "活动",
		apiUrl: "/services/app/v1/activity/list/myActivity",
		listItem: require("@/views/activity/flow-item-userActivity")
	},
	"0061": {
		desc: "评论"
	},
	"0071": {
		desc: "广告"
	},
	"0081": {
		desc: "成员"
	},
	"0091": {
		apiUrl: "/services/app/v1/release/info/list",
		link: "/publish/detail/:id",
		desc: "发布"
	},
	"0100": {
		apiUrl: "/services/app/v1/goods/context/list",
		link: "/product/detail/:id",
		listItem: require("@/views/product/components/flow-item-product"),
		desc: "闲置"
	},
	"0110": {
		apiUrl: "",
		link: "",
		desc: ""
	},
	"0200": { // 私圈
		apiUrl: "",
		link: "",
		desc: ""
	},
	"0210": { // 私圈主题
		apiUrl: "",
		link: "/general/details/:id",
		desc: ""
	},
	"0221": { // 私圈活动
		apiUrl: "",
		link: "/activity/details/:id",
		desc: "私圈活动"
	},
	"0230": { // 私圈话题-话题广场
		apiUrl: "",
		link: "/topic/home/:id",
		desc: ""
	},
	"0231": { // 私圈话题-话题详情
		apiUrl: "",
		link: "/topic/detail/:id",
		desc: ""
	},
	"0240": { // 私圈问答-问题详情
		apiUrl: "",
		link: "/question/detail/:id",
		desc: ""
	},
	"0241": { // 私圈问答-回答详情
		apiUrl: "",
		link: "/answer/detail/:id",
		desc: ""
	},
	"0120": { // 悬赏
		apiUrl: "",
		link: "",
		desc: ""
	}
};
