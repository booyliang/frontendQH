<template>
	<div class="temporary_activity-index">
		<y-search @search="onSearch"></y-search>

		<div class="intro_banner">
			<img :src="$attrs.activityData.coverPlan" :alt="$attrs.activityData.title">
		</div>
		<y-load-more-remote v-if="showList" :request="request" :useOpusApi="true" @loaded="handleLoaded" :endTip="false">
			<div class="candidate_list">
				<y-candidate-item :activityData="$attrs.activityData" v-for="(item, index) of list" :key="index" :data="item" :noVote="noVote" :activityStatus="status"></y-candidate-item>
			</div>
		</y-load-more-remote>
		<y-message v-if="list.length === 0 && !request.params.queryCondition" :icon="noDataIcon">
			<p>还没有人参与活动<br>现在参加赢得更多优势</p>
		</y-message>
		<y-message v-if="list.length === 0 && request.params.queryCondition" title="未搜到相关内容" :icon="noSearchResultIcon">
		</y-message>
		<span class="activity-button" v-if="showJoin" @click="join">我要</br>参加</span>
	</div>
</template>
<script>

import noDataIcon from '../../../assets/no-data.png';
import noSearchResultIcon from '../../../assets/no-search-result.png'
import YSearch from './components/search'
import YCandidateItem from '../components/work-item'
import YLoadMoreRemote from '@/components/load-more-remote'
import YMessage from '@/components/message';
import Mixin from '../mixins';
import moment from 'moment';
export default {
	name: 'vote-index',
	components: {
		YSearch,
		YCandidateItem,
		YLoadMoreRemote,
		YMessage
	},
	mixins: [Mixin],
	data() {
		return {
			showList: true,
			inApp: !!this.$yryz.isNative(),
			noDataIcon,
			noSearchResultIcon,
			noVote: false,
			list: [],
			voteDisabled: false,
			joinFlag: false,
			request: {
				url: '/yyl/v1/activity/candidate/list',
				params: {
					queryCondition: '',
					activityInfoId: this.$route.params.activityId,
					timestamp: new Date().getTime(),
				}
			}
		}
	},
	computed: {
		status() {
			if (this.$attrs.activityData.activityStatus === 2) {
				let start = moment(this.$attrs.activityData.activityVoteBegin).valueOf();
				let end = moment(this.$attrs.activityData.activityVoteEnd).valueOf();
				let current = moment(this.$attrs.activityData.currentDate).valueOf();
				if (current >= end) return 'activityVoteEnd';
				if (current < start) return 'activityVoteBegin';
				return 'activityIng';
			} else if (this.$attrs.activityData.activityStatus === 1)
				return 'activityBegin';
			else return 'activityEnd'
		},
		showJoin() {
			if (this.joinFlag) {
				this.$attrs.activityData['joinFlag'] = 1;
				return false;
			}
			let start = moment(this.$attrs.activityData.activityJoinBegin).valueOf();
			let end = moment(this.$attrs.activityData.activityJoinEnd).valueOf();
			let current = moment(this.$attrs.activityData.currentDate).valueOf();
			if (current < start || current >= end) return false;

			let activityData = this.$attrs.activityData;
			return activityData.activityStatus === 2 && activityData.userFlag === 1 && activityData.joinFlag !== 1 && activityData.joinCount < activityData.userNum;
		},
	},
	watch: {
		'$attrs.activityData': 'setShareData'
	},
	mounted() {
		if (!this.inApp && !this.$env.custId && this.isWeiXin())
			this.isWeiXinLogin();

		this.$eventBus.$on('updateVoteStatus', this.updataVoteStatus);
	},
	beforeDestroy() {
		this.$eventBus.$off('updateVoteStatus');
	},
	activated() {
		this.showList = true;
		this.setShareData();
		this.$eventBus.$off('refreshVoteList', this.refreshVoteList);
		let publishSuccess = sessionStorage.getItem('publishSuccess');
		if (publishSuccess) {
			// 刷新数据
			this.list = [];
			this.request.params.timestamp = new Date().getTime();
			this.joinFlag = true;
			this.$eventBus.$emit('reloadData');
			sessionStorage.removeItem('publishSuccess');
		}
	},
	deactivated() {
		this.$eventBus.$on('refreshVoteList', this.refreshVoteList);
	},
	methods: {
		refreshVoteList() {
			this.list = [];
			this.showList = false;
		},
		setShareData() {
			let activityData = this.$attrs.activityData;
			this.$utils.setBrowserShareInfo(activityData.title, activityData.content);
		},
		onSearch(value) {
			if (value === this.request.params.queryCondition) return;
			this.list = [];
			this.request.params.queryCondition = value;
		},
		handleLoaded(list, item) {
			this.list.push(...list);
		},
		async join() {
			if (this.inApp) {
				await this.$user.login();
			}
			if (this.$env.custId) {
				let response = null;
				let params = {
					custId: this.$env.custId,
				}
				if (this.isWeiXin()) {
					response = await this.$openApi.post(`/api/v3/user/loginMethod`, params);
					if (response.data.ret === 1) {
						let _data = response.data.data.filter(item => item.type === 4);
						if (_data.length && !_data[0].nickNname) {
							this.$eventBus.$emit('login');
							return false;
						}
					}
				}

				response = await this.$opusApi.get(`/yyl/v1/activity/vote/detail/${this.$route.params.activityId}`)
				let resData = response.data;
				if (resData.msg === 'success') {
					if (resData.data.activityStatus === 1) {
						this.$toast('活动未开始');
					} else if (resData.data.activityStatus === 3) {
						this.$toast('活动已结束');
					} else if (parseInt(resData.data.joinFlag) === 1) {
						this.$toast('您已参与活动');
					} else {
						this.$router.push({ name: 'voteJoin' })
					}
				} else {
					this.$toast(resData.msg);
				}
			} else {
				this.$eventBus.$emit('login');
			}
		},
		updataVoteStatus() {
			this.noVote = true;
		}
	}

}
</script>
<style>
@import '#/css/var.css';
.temporary_activity-index {
	& .message-title+* {
		margin: 0;
	}
	& .intro_banner {
		width: 100%;
		height: 3.36rem;
		overflow: hidden;

		& img {
			width: 100%;
			height: 100%;
		}
	}
	& .activity-button {
		@apply --circle;
		position: fixed;
		width: 1rem;
		height: 1rem;
		bottom: .2rem;
		right: .2rem;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFF;
		background-color: var(--theme-color);
		line-height: 1;
		/* box-shadow: 0 0 10px rgba(51, 51, 51, .3); */
	}
}
</style>
