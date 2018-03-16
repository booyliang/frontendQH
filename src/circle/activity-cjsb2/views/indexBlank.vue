<template>
	<div class="temporary_activity">
		<!--头部导航 S-->
		<y-nav title="长江商报·红牛2017武汉大学生艺术创业" :showLeftArrow="inApp ? true : false"></y-nav>

		<!--头部导航 E-->

		<y-tab-bar v-model="tabId" :tabOption="tabOption" @click="changeTab" :enable-router="false"></y-tab-bar>

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
			showLeftArrow: false,
			inApp: this.$yryz.isNative(),
			tabId: 0,
			tabOption: [
				{ id: 0, text: '首页', name: 'index' },
				{ id: 1, text: '活动介绍', name: 'introduce' },
				{ id: 2, text: '投票排名', name: 'rank' },
				// { id: 3, text: '活动资讯', name: 'notice' },     //  暂无文案隐藏
			],
		}
	},
	watch: {
		'$route': 'selectTab',
	},
	methods: {
		changeTab(tabId, tabItem) {
			this.$router.push({ name: tabItem.name });
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
</style>
