<template>
	<div class="temporary_activity">
		<!--头部导航 S-->
		<y-nav title="武汉大学生跨境电商创业大赛"></y-nav>
		<!--头部导航 E-->

		<y-tab-bar v-model="tabId" :tabOption="tabOption" @click="changeTab" :enable-router="false">
			<!-- <span v-if="!isRead" class="dot"></span> -->
		</y-tab-bar>

		<router-view></router-view>
	</div>
</template>

<script>
import { YNav, YNavSearch, YNavToggle } from '@/components/nav';
import YTabbar from '@/components/tab';

export default {
	name: 'vote-index',
	components: {
		YNav, YNavToggle, YNavSearch
	},
	data() {
		return {
			tabId: 0,
			tabOption: [
				{ id: 0, text: '首页', name: 'index' },
				{ id: 1, text: '活动介绍', name: 'introduce' },
				{ id: 2, text: '投票排名', name: 'rank' },
				{ id: 3, text: '活动资讯', name: 'notice' },
			],
		}
	},
	watch: {
		'$route': 'selectTab',
	},
	methods: {
		changeTab(tabId, tabItem) {
			this.$router.push({name: tabItem.name});
		},
		selectTab() {
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
	}
	.platform-activity-details-wrap {
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
