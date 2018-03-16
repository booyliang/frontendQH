<template>
	<div class="activity-homepage-wrap">
		<!--头部导航 S-->
		<y-nav :title="$R('activity-home')" :menuData="menuData"></y-nav>
		<!--头部导航 E-->
	
		<!--活动主页头部公共部分 S-->
		<div class="head-public" v-if="activityData">
			<div class="activity-head-area">
				<div class="activity-cover">
					<img :src="activityData.activityImg | imageResize(5)">
					<!--活动未开始 或 活动进行中-->
					<div class="activity-date">
						<div class="activity-count-down" v-if="showStatus">
							<span class="head-icon">
								<span class="iconfont icon-clock"></span>
								<span v-text="showText"></span>
							</span>
							<y-count-down v-if="showCount" :endDate="endDate" :nowDate="activityData.currentTime" @countdown_end="countdownEnd"></y-count-down>
						</div>
						<!--活动已结束-->
						<div class="activity-ended" v-else>
							<span class="iconfont icon-clock"></span>
							<span v-text="$R('activity') + $R('ended')"></span>
						</div>
					</div>  
				</div>
				<!-- 标题  时间 -->
				<div class="activity-info">
					<div class="activity-title" v-text="activityData.activityTitle"></div>
					<div v-text="$R('activity-time')+'：'+activityTime" class="activity-time"></div>
				</div>
			</div>
	
			<y-list>
				<y-item v-if="activityData.awardContext" class="award-context" vertical>
					<div slot="head">
						<span class="iconfont icon-gift"></span>
						<span v-text="$R('activity-prizes')"></span>
					</div>
					<div slot="foot" class="content" v-html="activityData.awardContext"></div>
				</y-item>
				<y-item v-if="activityData.address" vertical>
					<div slot="head">
						<span class="iconfont icon-addr-a-b"></span>
						<span v-text="$R('activity-address')"></span>
					</div>
					<div slot="foot" class="activity-address-nav">
						<div class="activity-address" v-text="getAddress" :style="navStyle"></div>
						<div class="activity-nav" @click="openMap" v-if="hasUserId">
							<div class="iconfont icon-arrow"></div>
							<div>{{$R('navigation')}}</div>
						</div>
					</div>
				</y-item>
				<y-item :value="activityData.activityIntroduction" vertical>
					<div slot="head">
						<span class="iconfont icon-tips-a"></span>
						<span v-text="$R('activity-intro')"></span>
					</div>
				</y-item>
				<y-item v-if="activityData.tname" vertical>
					<div slot="head">
						<span class="iconfont icon-siquan"></span>
						<span v-text="$R('private-circle')"></span>
					</div>
					<div slot="foot" v-text="activityData.tname" @click="joinTeam"></div>
				</y-item>
				<y-fold-item :title="$R('activity-detail')" :openField="$R('fold')" :closeField="$R('unfold')" :content="activityData.activityContent" icon="icon-intr-a"></y-fold-item>
			</y-list>
		</div>
		<!--活动主页头部公共部分 E-->
	
		<!-- 活动作品 S -->
		<div class="activity-works" v-if="activityData && activityData.activityStatus !== 1">
			<y-item vertical>
				<div slot="head" v-if="activityData.activityType === 2">
					<span class="iconfont icon-pen-a"></span>
					<span v-text="$R('activity-works')"></span>
				</div>
				<!--作品 list-->
				<div class="content_list" slot="addon">
					<!--报名类活动-->
					<template v-if="activityData.activityType == 1">
						<p class="member-num" v-text="memberText"></p>
						<ul class="member-list" v-if="signUpMembers.length > 0">
							<li v-for="(item,index) of signUpMembers" :key="item.id" v-if="index<5">
								<y-card :title="item.nickName" :src="item.headImg" position="vertical" :to="`/user/${item.userId}`"></y-card>
							</li>
							<li class="arrow-more iconfont icon-arrow-right" @click="goSignUpNumber" v-if="signUpMembers.length > 5"></li>
						</ul>
					</template>
	
					<!--投票类活动-->
					<template v-if="activityData.activityType == 2">
						<y-load-more-remote :request="flowRequest" @loaded="handleLoaded">
							<y-list class="flow_list" :class="activityData.articleType === 2 || activityData.articleType === 4 ? 'list-columns' : ''">
								<y-flow-item-activity-works v-for="(item, index) of userData" :key="index" :data="item" :hasVoteThree="hasVoteThree || item.hasVoteThree" @update_vote="update_vote" :isFirst="true"></y-flow-item-activity-works>
								<y-flow-item-activity-works v-for="(item, index) of flowList" :key="index" :data="item" :hasVoteThree="hasVoteThree || item.hasVoteThree" @update_vote="update_vote"></y-flow-item-activity-works>
							</y-list>
						</y-load-more-remote>
					</template>
				</div>
			</y-item>
			<!-- 参与活动 button -->
			<div class="join-activity" v-if="isCanJoin" @click="toPublicPage">
				<i class="iconfont icon-plus"></i>
				<span v-text="$R('participate-activity')"></span>
			</div>
		</div>
		<!-- 活动作品 E -->
	</div>
</template>

<script>
import { YNav, YNavSearch, YNavToggle } from '@/components/nav';
import LoadMoreRemote from '@/components/load-more-remote';
import YCard from '@/components/card';
import CountDowm from './components/count-down';
import Button from '@/components/button';
import YList from '@/components/list';
import YItem from '@/components/item';
import FoldItem from '@/views/activity/components/fold-item';
import Works from '@/views/activity/components/flow-item-activity-works';
import Action from '@/components/comment/action';
import mapNav from '@/components/map-nav'
import Toast from '@/components/toast'
import moment from 'moment'

export default {
	components: {
		YNav, YNavToggle, YNavSearch, YCard, Works, Toast,
		[LoadMoreRemote.name]: LoadMoreRemote,
		[CountDowm.name]: CountDowm,
		[Button.name]: Button,
		[YList.name]: YList,
		[YItem.name]: YItem,
		[FoldItem.name]: FoldItem,
		[Works.name]: Works,
	},
	data() {
		return {
			menuData: [{
				icon: 'share-o',
				text: this.$R('menu-share'),
				action: this.action
			}, 'index', 'copy-url', 'report'],
			shareData: null,
			activityData: null,
			signUpMembers: [],
			userData: [],
			hasUserId: false,
			flowList: [],
			hasVoteThree: null,
			showCount: true
		}
	},
	computed: {
		activityTime() {
			let index = this.activityData.signupStartDate.lastIndexOf(':');
			let s = this.activityData.signupStartDate.slice(0, index).replace(/-/g, '.');
			let e = this.activityData.signupEndDate.slice(0, index).replace(/-/g, '.');
			return `${s}-${e}`;
		},

		flowRequest() {
			return {
				url: `/services/app/v1/activityticket/list/${this.$route.params.id}`
			};
		},

		showStatus() {
			return this.activityData.activityStatus === 1 || this.activityData.activityStatus === 2;
		},

		memberText() {
			return this.$R('participants-numb', this.signUpMembers.length);
		},

		showText() {
			var str = this.activityData.activityStatus === 1
				? this.$R('activity-start-time')
				: this.$R('activity-end-time');
			return str;
		},
		// 根据活动状态判断传入 活动开始时间 || 活动结束时间
		endDate() {
			return this.activityData.activityStatus === 1
				? this.activityData.signupStartDate
				: this.activityData.signupEndDate;
		},
		getAddress() {
			return this.activityData.address.replace(/,/g, '');
		},
		isCanJoin() {
			return this.activityData.releaseFlag === 1 && this.activityData.activityStatus === 2 && this.hasUserId;
		},
		navStyle() {
			return this.hasUserId
				? { 'padding-right': '.5rem' }
				: { 'padding-right': '0' }
		}
	},

	async created() {
		// console.log('circle', this.$circle);
		// console.log('userId', this.$circle.userId);
		// console.log('env', this.$env);
		// console.log('userId', this.$env.userId);
		this.hasUserId = this.$circle.userId ? true : false;

		// 活动详情接口
		let _data = await this.$http.get(`/services/app/v1/activity/single/${this.$route.params.id}`);
		if (_data.data.code !== '200') return false;
		this.activityData = Object.assign({}, _data.data.data);

		// this.activityData.currentTime = '2017-08-09 10:21:50'
		// this.activityData.signupStartDate = '2017-08-09 10:22:01';
		// this.activityData.activityStatus = 1;

		this.$localStore.set('count', this.activityData.oneWorkVoteCount);
		this.shareData = {
			imgUrl: this.activityData.activityImg,
			title: this.activityData.activityTitle,
			content: this.activityData.activityIntroduction,
			id: this.activityData.id,
			moduleEnum: this.activityData.moduleEnum
		}

		// 活动参与人员
		if (this.activityData.activityType === 1) {
			this.$http.get(`/services/app/v1/activityticket/list/${this.$route.params.id}/1/9999`).then((res) => {
				if (res.data.code === '200') {
					this.signUpMembers.push(...res.data.data.entities);
				}
			})
		}

		// 查询当前用户的作品
		this.$http.get(`/services/app/v1/activityticket/single/${this.$route.params.id}`).then((res) => {
			if (res.data.code === '200') {
				this.userData = res.data.data;
				if (this.activityData.activityType === 1) {
					this.signUpMembers.unshift(...this.userData);
				}
			}
		})
	},

	methods: {
		handleLoaded(list, res) {
			this.flowList.push(...list);
		
		},
		beforeDestroy() {
			mapNav.hide();
		},

		joinTeam() {
			if (!this.hasUserId) return false; // 分享落地页
			if (this.activityData.joinFlag === '0') {
				this.$yryz.joinTeam({ teamId: this.activityData.teamId, verifyType: this.activityData.joinMode }).then(data => {
					if (data.status === 1) {
						Toast(this.$R('member-join-success'));
					} else if (data.status === 2) {
						Toast(this.$R('member-send-success'));
					} else {
						Toast(this.$R('member-send-error'));
					}
				});
				return false;
			}
			this.$yryz.sessionTeam({ teamId: this.activityData.teamId });
		},

		// 参与活动
		async toPublicPage() {
			// 活动状态 下架处理
			let _data = await this.$http.get(`/services/app/v1/activity/selectShelveFlag/${this.$route.params.id}`);
			if (_data.data.code !== '200') return false;
			let shelveFlag = _data.data.data.shelveFlag;
			if (shelveFlag === '1') {
				this.$router.replace({ path: `/activity/homepage/${this.$route.params.id}` });
				return false;
			}
			if (this.activityData.activityType === 1) {  // 报名类活动
				this.$router.push({ path: `/activity/new/${this.$route.params.id}` });
			} else if (this.activityData.activityType === 2) {  // 投票类活动
				this.$router.push({ path: `/activity/vote/new/${this.$route.params.id}/${this.activityData.articleType}` })
			}
		},

		// 参与人员list
		goSignUpNumber() {
			this.$router.push({ path: `/activity/participants/${this.$route.params.id}` })
		},

		// 倒计时结束
		countdownEnd() {
			this.showCount = false;
			// 活动详情接口
			this.$http.get(`/services/app/v1/activity/single/${this.$route.params.id}`).then(res => {
				let _data = res.data;
				if (_data.code === '200') {
					this.activityData = Object.assign({}, _data.data);
					this.showCount = true;
				}
			})
			// console.log(this.activityData.activityStatus);
			// this.$router.replace(`/activity/homepage/${this.$route.params.id}`)
			// this.activityData.activityStatus = this.activityData.activityStatus === 1 ? 2 : 3;
		},

		// 分享
		action() {
			Action["share"].call(this, this.shareData, true);
		},

		update_vote(data) {
			this.hasVoteThree = data >= this.activityData.oneWorkCount;
		},
		openMap() {
			if (!this.activityData.address) {
				console.error('address cannot null!');
				return false;
			}
			let addr = this.activityData.address.split(',');
			let param = {};
			if (addr.length === 3) {
				param = {
					province: addr[0],
					city: addr[1],
					address: addr[2],
					lat: this.activityData.latitude,
					lng: this.activityData.accuracy,
				}
			} else {
				param = {
					province: addr[0],
					city: addr[0],
					address: addr[1],
					lat: this.activityData.latitude,
					lng: this.activityData.accuracy,
				}
			}
			// console.log(param);
			mapNav.init(param)
		}
	}
}
</script>

<style>
@import "#/css/var.css";
.activity-homepage-wrap {
	& .head-public {
		& .activity-head-area {
			background: white;
			line-height: 1;
			color: var(--text-primary-color);
			margin-bottom: .2rem;
			& .activity-cover {
				/* display: block; */
				position: relative;
				&>img {
					display: block;
				}
				& .activity-date {
					position: absolute;
					bottom: 0;
					width: 100%;
					color: #fff;
					background: var(--bg-alpha-color);
					padding: .2rem;
					& .activity-count-down {
						display: flex;
						justify-content: space-between;
						font-size: 15px;
						line-height: .4rem;
						& .head-icon {
							& .iconfont {
								font-size: 17px;
							}
						}
					}
					& .activity-ended {
						text-align: center;
						& .iconfont {
							font-size: 17px;
						}
					}
				}
			}
			& .activity-info {
				padding: .3rem;
				& .activity-title {
					font-size: 22px;
					margin: .1rem 0;
				}
				& .activity-time {
					color: var(--text-assist-color);
					padding: .2rem 0;
					font-size: 13px;
				}
			}
		}

		& .list {
			& .item {
				& .item-wrap {
					border-top: 1px solid #EEEEEE;
					& .item-head {
						& div {
							& .iconfont {
								color: var(--theme-color);
								opacity: .5;
							}
						}
					}
					& .item-foot {
						& .activity-address-nav {
							display: flex;
							justify-content: space-between;
							align-items: center;
							width: 100%;
							& .activity-address {
								/* padding-right: .5rem; */
							}
							& .activity-nav {
								display: block;
								width: 2rem;
								padding-left: .2rem;
								border-left: 1px solid var(--border-color);
								text-align: center;

								& .iconfont {
									color: #00AFF7;
								}
							}
						}
					}
				}
			}

			& .award-context {
				& .item-wrap {
					border-top: none;
				}
			}
		}
	}


	& .activity-works {
		background: #fff;
		padding-bottom: 1.2rem;
		& .item {
			& .item-wrap {
				border-top: 1px solid #EEEEEE;
				& .item-head {
					& div {
						& .iconfont {
							color: var(--theme-color);
							opacity: .5;
						}
					}
				}
			}
		}
		& .item-addon {
			padding: 0;
			& .content_list {
				& .member-num {
					text-align: center;
					padding: .4rem 0;
					color: var(--text-tips-color);
				}

				& .member-list {
					position: relative;
					text-align: center;
					padding-bottom: .3rem;
					& li {
						display: inline-block;
						margin: 0 .1rem 0;
						@apply --text-cut;
						& .y_card {
							& .y_avatar {
								margin: 0 auto 0.1rem;
							}

							& .y_card-text {
								& h4 {
									color: var(--text-primary-color);
								}
							}

							& .y_card-title {
								width: 4em;
								@apply --text-cut;
							}
						}
					}
					& .arrow-more {
						color: #bfbfbf;
						vertical-align: super;
						position: relative;
						top: -.05rem;
					}
				}

				& .content-body {
					& .img-mask {
						height: auto;
					}
				}

				& .list-columns {
					display: flex;
					flex-wrap: wrap;
				}
			}
		}


		& .join-activity {
			position: fixed;
			bottom: 0;
			width: 100%;
			text-align: center;
			color: #fff;
			background: var(--theme-color);
			font-size: 16px;
			padding: .3rem 0;
		}
	}
}
</style>
