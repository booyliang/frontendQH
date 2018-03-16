export default [
	{
		path: "question/index",
		name: 'coterieQuestionList',
		component: require("../question/index"),
		// meta: { keepAlive: true }
	},
	{
		path: "question/new",
		name: 'coterieQuestionNew',
		component: require("../question/new"),
	},
	{
		path: "question/answer/:questionId",
		name: 'coterieQuestionAnswer',
		component: require("../question/answer"),
	},
	{
		path: "answer/detail/:answerId",
		name: 'coterieAnswerDetail',
		component: require("../question/details"),
	},
	{
		path: "question/detail/:questionId",
		name: 'coterieQuestionDetail',
		component: require("../question/details"),
	}
];