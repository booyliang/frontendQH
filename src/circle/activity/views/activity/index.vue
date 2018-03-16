<template>
	<div class="platform-activity-wrap">
		<!--头部导航 S-->
		<y-nav title="活动"> </y-nav>
		<!--头部导航 E-->

		<y-tab-bar v-model="tabId" :tabOption="tabOption"></y-tab-bar>
		<!-- <flow-list :request="flowRequest" :dataItem="Item"></flow-list> -->
		<y-load-more-remote :request="request" @loaded="handleLoaded" :useOpusApi="true" :endTip="false">
			<div>
				<activity-item v-for="(item, index) of list" :key="index" :data="item"></activity-item>
			</div>
		</y-load-more-remote>
		<y-message v-if="!list.length" :icon="icon" :title="msgTitle"></y-message>
	</div>
</template>

<script>
import { YNav, YNavSearch, YNavToggle } from '@/components/nav';
import YMessage from '@/components/message';
import ActivityItem from './components/activity-item';
import LoadMoreRemote from '@/components/load-more-remote'
// import FlowList from './components/flow-list';
import icon from '@/assets/static/no-data@2x.png';
export default {
	name: 'activty',
	components: {
		YNav, YNavToggle, YNavSearch, YMessage, ActivityItem,
		[LoadMoreRemote.name]: LoadMoreRemote,
	},
	computed: {
		request() {
			return {
				url: `/yyl/v1/activity/info/list/${this.type}`,
			}
		},
		msgTitle() {
			return this.tabId === 0 ? '暂无进行中活动' : '暂无往期活动';
		}
	},
	watch: {
		tabId(newVal, oldVal) {
			if (newVal === oldVal) return false;
			this.type = this.tabId === 1 ? 2 : 1;
			this.list = [];
		}
	},
	data() {
		return {
			tabId: parseInt(this.$route.params.tabId) || 0,
			tabOption: [
				{ id: 0, text: '进行中活动' },
				{ id: 1, text: '往期活动' },
			],
			list: [],
			icon,
			Item: ActivityItem,
			type: 1,
		}
	},
	mounted() {
		this.type = this.tabId === 1 ? 2 : 1;
	},
	methods: {
		handleLoaded(list, item) {
			this.list.push(...list);
		}
	}
}
</script>

<style>
@import "#/css/var.css";
.platform-activity-wrap {
	& .message {
		padding-top: 1.6rem;
		& .message-icon {
			width: 3.2rem;
			height: 3.2rem;
		}
		& .message-title {
			margin-top: -.5rem;
			font-size: 15px;
		}
		& span {
			color: var(--text-assist-color);
		}
	}
}
</style>
