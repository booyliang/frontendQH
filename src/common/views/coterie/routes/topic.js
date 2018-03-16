export default [{
	path: "topic/index",
	component: require("../topic/index")
},
{
	path: "topic/home/:topicId",
	name: 'coterieHome',
	component: require("../topic/home")
},
{
	path: "topic/detail/:invitationId",
	name: 'coterieTopicDetail',
	component: require("../topic/detail")
},
{
	path: "topic/new",
	name: 'topicNew',
	component: require("../topic/new")
},
{
	path: "topic/join/:topicId",
	component: require("../topic/join")
}
]