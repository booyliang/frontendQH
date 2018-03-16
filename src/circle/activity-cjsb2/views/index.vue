<template>
	<div class="temporary_activity-index">
		<y-search @search="onSearch"></y-search>
		<div class="intro_banner"><img src="../assets/intro_banner.png" alt=""></div>
		<y-load-more-remote :request="request" @loaded="handleLoaded" :endTip="false">
			<div class="candidate_list">
				<y-candidate-item v-for="(item, index) of list" :key="index" :data="item"></y-candidate-item>
			</div>
		</y-load-more-remote>
		<y-message v-if="list.length === 0 && !request.params.voteNo" :icon="noDataIcon">
			<p>还没有人参与活动<br>现在参加赢得更多优势</p>
		</y-message>
		<y-message v-if="list.length === 0 && request.params.voteNo" title="未搜到相关内容" :icon="noSearchResultIcon">
		</y-message>
		<span class="activity-button" @click="join">我要</br>参加</span>
	</div>
</template>
<script>
import noDataIcon from '../assets/no-data.png';
import noSearchResultIcon from '../assets/no-search-result.png'
import YSearch from './components/search'
import YCandidateItem from './components/candidate-item'
import YLoadMoreRemote from '@/components/load-more-remote'
import YMessage from '@/components/message'
export default {
	name: 'activityIndex',
	components: {
		YSearch,
		YCandidateItem,
		YLoadMoreRemote,
		YMessage
	},
	data() {
		return {
			noDataIcon,
			noSearchResultIcon,
			list: [],
			request: {
				url: '/services/app/v1/temp/activity/opus/list/1',
				params: {
					voteNo: ''
				}
			},
			voteDisabled: false
		}
	},
	methods: {
		onSearch(value) {
			if (value === this.request.params.voteNo) return;
			this.list = [];
			this.request.params.voteNo = value;
		},
		handleLoaded(list, item) {
			this.list.push(...list);
		},
		async join() {
			if (this.inApp) await this.$user.login();
			if (this.$env.custId) {
				let response = await this.$http.get(`/services/app/v1/temp/activity/opus/judgeJoin`)
				let resData = response.data;
				if (resData.code === '200') {
					if (parseInt(resData.data.joinFlag) === 1) {
						this.$toast('您已参与活动');
					} else {
						this.$router.push('/join')
					}
				}
			} else {
				this.$eventBus.$emit('login');
			}
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
