import Index from '../views/activity/index';
import PlatformActivityMain from '../views/activity/main'
import VoteMain from '../views/activity/vote/main'
import VoteIndexBlank from '../views/activity/vote/index-blank'
import VoteIndex from '../views/activity/vote/index'
import VoteIntroduce from '../views/activity/vote/introduce'
import VoteRank from '../views/activity/vote/rank'
import VoteNotice from '../views/activity/vote/notice'
import VoteDetail from '../views/activity/vote/detail'
import VoteJoin from '../views/activity/vote/join'
import VoteShare from '../views/activity/vote/share'
// import VoteShareO from '../views/activity/vote/share-o'
import Prizes from '../views/activity/vote/prizes'
import PrizesSuccess from '../views/activity/vote/prizes-success'

import Signup from '../views/activity/signup/index';
import SignupNew from '../views/activity/signup/new';
import SignupShare from '../views/activity/signup/share';

// import Vote from '../views/activity/vote/index';
// import VoteDetail from '../views/activity/vote/detail';
// import VoteNew from '../views/activity/vote/new';
// import VoteShare from '../views/activity/vote/share';
// import VoteGuide from '../views/activity/vote/share-guide';
// import Prizes from '../views/activity/vote/prizes';
// import PrizesSucess from '../views/activity/vote/prizes-success';

import QqlIndex from '../views/qql/index';
import QqlRecord from '../views/qql/record';
import QqlRule from '../views/qql/rule';

import KingDom from '../views/quanhu/kingdom';
import WangZhe from '../views/quanhu/wangzhe';

import PlatformSignup from '../views/signup/index';
import PlatformSignupSuccess from '../views/signup/success';

import Yiban from '../views/yiban/index';

let routes = [
	{ path: '/vote-baiquan', component: require('../views/vote-baiquan/index') },
	{ path: '/vote-baiquan/result', component: require('../views/vote-baiquan/result') },
	{ path: '/vote-baiquan/register', component: require('../views/vote-baiquan/register') },
	{ path: '/vote-baiquan/download', component: require('../views/vote-baiquan/download') },
	{ path: '/xycf/haidao', component: require('../views/xycf/haidao') },
	{ path: '/xycf/help', component: require('../views/xycf/help') },
	{ path: '/reward', component: require('../views/reward/index') }, // 悬赏
	{ path: "/reward/detail/:id", component: require("../views/reward/details") }, // 悬赏详情
	{ path: "/reward/new", component: require("../views/reward/new") }, // 发布悬赏
	{ path: "/reward/join/:id", component: require("../views/reward/join") }, // 参与悬赏
	{ path: "/new-circles", component: require("../views/new-circles/index") }, // 发布的圈子
	// 圈乎运营活动
	{ path: '/quanhu/kingdom', component: require('../views/quanhu/kingdom') }, // 冰雪王国
	{ path: '/quanhu/wangzhe', component: require('../views/quanhu/wangzhe') }, // 王者荣耀 
	// 平台活动

	{
		path: "/platform-activity/index",
		component: Index,
		name: 'platformActivityIndex',
		meta: { keepAlive: true, disableForward: true },
	},
	{
		path: "/platform-activity",
		component: PlatformActivityMain,
		name: 'platformActivityMain',
		redirect: { name: 'platformActivityIndex' },
		meta: { disableForward: true },
		beforeEnter: (to, from, next) => {
			if (from.path === '/' && ['signupIndex', 'voteIndex', 'voteDetail'].indexOf(to.name) === -1) {
				let activityIndexRoute = { params: { activityId: to.params.activityId } };
				activityIndexRoute.name = to.path.indexOf('signup') > -1 ? 'signupIndex' : 'voteIndex';
				next(activityIndexRoute);
			}
			// else if (from.name === 'voteShare') {
			// 	this.$eventBus.$emit('global-message', { type: 'refresh' });
			// }
			next();
		},
		children: [
			{
				path: 'vote/:activityId',
				component: VoteMain,
				redirect: { name: "voteIndex" },
				meta: { disableForward: true },
				children: [
					{
						path: 'home',
						component: VoteIndexBlank,
						redirect: { name: "voteIndex" },
						meta: { disableForward: true },
						children: [
							{
								path: 'index',
								name: 'voteIndex',
								component: VoteIndex,
								meta: { keepAlive: true, disableForward: true },
							},
							{
								path: 'introduce',
								name: 'voteIntroduce',
								component: VoteIntroduce,
								meta: { keepAlive: true, disableForward: true },
							},
							{
								path: 'rank',
								name: 'voteRank',
								component: VoteRank,
								meta: { keepAlive: true, disableForward: true },
							},
							{
								path: 'notice',
								name: 'voteNotice',
								component: VoteNotice,
								meta: { keepAlive: true, disableForward: true },
							}
						]
					},
					{
						path: 'detail/:id',
						component: VoteDetail,
						name: 'voteDetail',
						meta: { disableForward: true }
					},
					{
						path: 'join',
						component: VoteJoin,
						name: 'voteJoin',
						meta: { disableForward: true }
					},
					{
						path: 'share/:id',
						component: VoteShare,
						name: 'voteShare',
						meta: { disableForward: true }
					},
					// {
					// 	path: 'share-o/:id',
					// 	component: VoteShareO,
					// 	name: 'voteShareO',
					// 	meta: { disableForward: true }
					// },
					{
						path: 'prizes',
						component: Prizes,
						name: 'prizes',
						meta: { disableForward: true }
					},
					{
						path: 'prizes/success',
						component: PrizesSuccess,
						name: 'prizesSuccess',
						meta: { disableForward: true }
					}
				]
			},
			{ path: "signup/:activityId", name: 'signupIndex', component: Signup, meta: { disableForward: true } },
			{ path: "signup/:activityId/new", component: SignupNew, meta: { disableForward: true } },
			{ path: "signup/:activityId/share", component: SignupShare, meta: { disableForward: true } },
			// { path: "vote/:activityId", component: Vote, meta: { keepAlive: true, disableForward: true } },
			// { path: "vote/:activityId/detail/:id", component: VoteDetail, meta: { disableForward: true } },
			// { path: "vote/:activityId/new", component: VoteNew },
			// { path: "vote/:activityId/guide/:id/", component: VoteGuide },
			// { path: "vote/:activityId/detail/:id/share", component: VoteShare },
			// { path: "vote/:activityId/detail/:id/prizes", component: Prizes, meta: { disableForward: true } },
			// { path: "vote/:activityId/detail/:id/prizes-success", component: PrizesSucess, meta: { disableForward: true } },
		]
	},

	// 圈圈乐
	{ path: '/qql', component: QqlIndex },
	{ path: '/qql/record', component: QqlRecord },
	{ path: '/qql/rule', component: QqlRule },

	{ path: '/signup', name: 'platformSignup', meta: { disableForward: true }, component: PlatformSignup },
	{ path: '/signup/success', name: 'platformSignupSuccess', meta: { disableForward: true }, component: PlatformSignupSuccess },

	{ path: '/yiban', meta: { disableForward: true }, component: Yiban }
];
export default routes;
