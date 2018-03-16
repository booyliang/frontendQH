<template>
	<div class="temporary_activity">
		<!--头部导航 S-->
		<y-nav :title="activityData.title" :showLeftArrow="inApp ? true : false">
			<span slot="nav-right" v-if="inApp">
				<y-button type="text" class="iconfont icon-more" @click.native.stop="onAction"></y-button>
			</span>
		</y-nav>
		<!--头部导航 E-->
		<y-tab-bar v-model="tabId" :tabOption="tabOption" @click="changeTab" :enable-router="false">
			<span v-if="!isRead" class="dot"></span>
		</y-tab-bar>
		<router-view :activityData="activityData"></router-view>
	</div>
</template>

<script>
import Action from '@/components/comment/action';
import { YNav, YNavSearch, YNavToggle } from '@/components/nav';
import YTabbar from '@/components/tab';

export default {
	name: 'vote-blank',
	components: {
		YNav,
		YNavToggle,
		YNavSearch
	},
	props: {
		activityData: {
			type: Object,
			default: () => { }
		}
	},
	data() {
		return {
			inApp: !!this.$yryz.isNative(),
			menuData: [
				{
					text: '分享',
					handler: () => this.share()
				},
				{
					text: '复制链接',
					handler: () => this.copyUrl()
				}
			],
			tabId: 0,
			tabOption: [
				{ id: 0, text: '首页', name: 'voteIndex' },
				{ id: 1, text: '活动介绍', name: 'voteIntroduce' },
				{ id: 2, text: '投票排名', name: 'voteRank' },
				{ id: 3, text: '中奖公告', name: 'voteNotice' },
			],
			fromSelf: false,
			isRead: true,
			ids: [],
		}
	},
	watch: {
		'$route': 'selectTab',
		activityData(val) {
			if (!val) return false;
			this.ids = JSON.parse(localStorage.getItem(`ids`)) || [];
			if (val.prizesSources)
				this.isRead = this.ids.filter(id => id === this.activityData.id).length;
		}
	},
	methods: {
		onAction() {
			this.$actionsheet(this.menuData);
		},
		share() {
			let shareData = Object.assign({}, this.activityData, {
				coverPlanUrl: this.activityData.coverPlan,
			})
			Action["share"].call(this, shareData, true, this.actions);
		},
		copyUrl() {
			this.$yryz.pasteboard({
				text: this.$utils.getShareUrl()
			}).then(() => {
				this.$toast(this.$R('copy-success'));
			});
		},
		changeTab(tabId, tabItem) {
			// 自首页的跳转以push开始，其他的为replace
			let routerAction = this.fromSelf ? 'push' : 'replace';
			this.$router[routerAction]({ name: tabItem.name });
			if (tabId === 3 && !this.isRead && this.data.prizesSources) {
				this.ids.unshift(this.activityData.id);
				if (this.ids.length > 100) this.ids.pop();
				localStorage.setItem(`ids`, JSON.stringify(this.ids));
				this.isRead = true;
			}
		},
		selectTab(to, from) {
			// 判断当前入口是否为首页，从首页开始的tab切换为push，非首页的为replace
			this.fromSelf = (!to || to.name === 'voteIndex');
			this.tabOption.forEach(item => {
				if (item.name === this.$route.name) {
					this.tabId = item.id;
				}
			})
		}
	},
	mounted() {
		this.selectTab();
	}
}
</script>

<style>
@import '#/css/var.css';
.temporary_activity {
	& .tab_bar-wrap {
		padding-top: .2rem;
		background: #fff;
	}
	& .tab_bar a {
		border: none;
	}
	& .dot {
		@apply --circle;
		position: absolute;
		top: .24rem;
		right: .48rem;
		width: .16rem;
		height: .16rem;
		background-color: #fb4545;
		z-index: 20;
	}
}
</style>
