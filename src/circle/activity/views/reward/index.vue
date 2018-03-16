<template>
	<div class="reward_index">
		<y-nav title="悬赏" :showLeftArrow="false"></y-nav>
		<y-tab-bar :tabOption="tabOption" v-model="tabId" ref="tab_bar"></y-tab-bar>
		<y-load-more :state="state" @can-load="onCanLoad" :endTip="!empty" :class="`tab${tabId}-list`">
			<div class="reward-list" >
				<y-reward-item  v-for="(item, index) of rewardList" :key="index" :data="item"></y-reward-item>
				<div v-if="empty" class="empty-tip">
					<div class="no-data"></div>暂无内容
				</div>
			</div>
		</y-load-more>
		
		<y-publish-entry  @button-clicked="jumpUrl">
			<span class="iconfont icon-plus"></span>
		</y-publish-entry>
	</div>
</template>
<script>
import LoadMore from '@/components/load-more';
import RewardItem from './components/reward-item'
import PublishEntry from '@/components/publish-entry';
export default {
	components: {
		[RewardItem.name]: RewardItem,
		[LoadMore.name]: LoadMore,
		[PublishEntry.name]: PublishEntry,
	},
	data() {
		return {
			tabId: this.$route.params['tabId'] || 1,
			tabOption: [
				{ id: 1, text: "正在悬赏" },
				{ id: 2, text: '答案公示'},
				{ id: 3, text: '悬赏结果'},
			],
			state: undefined,
			loaded: false,
			rewardList: [],
			limit: 10,
			offerId: '',
		}
	},
	computed: {
		empty() {
			return this.loaded && !this.rewardList.length;
		},
		params() {
			// if (this.$env.devId === "123456578")
				// this.$env.custId = 'r3l7bbgi'
			return {
				custId: this.$env.custId || "",
				limit: this.limit,
				offerId: this.offerId,
				type: this.tabId
			}
		}
	},
	watch: {
		tabId() {
			this.rewardList = [];
			this.offerId = "",
			this.getdata()
		},
	},
	mounted() {
		this.$yryz.on('nativeRewardRefresh', this.refresh)		
		this.getdata();
	},
	beforeDestroy() {
		this.$yryz.off('nativeRewardRefresh', this.refresh)
		
	},
	methods: {
		refresh() {
			this.$utils.refresh();
		},
		onCanLoad() {
			this.getdata();
		},
		getdata() {
			this.state = "loading";
			let params = this.params;
			this.$openApi.get(`/api/v3/offer/list`, { params }).then(res => {
				if (res.data.ret === 1) {
					this.loaded = true;
					let data = res.data.data || [];
					if (data.length < this.limit) {
						this.state = "end";
					} else {
						this.offerId = data[data.length - 1].offerId;
						this.state = "prepared";
					}
					this.rewardList.push(...data);
				} else {
					console.log(res.data.msg);
				}
			});
		},
		async jumpUrl() {
			await this.$user.login();
			// 查询当前用户是否被禁言
			let postData = { custId: this.$env.custId }
			let res = await this.$openApi.post(`/api/v3/permission/getAllPermission`, postData);
			let ResData = res.data;
			console.log("ResData", JSON.stringify(ResData))
			if ( ResData.ret === 1 ) {
				if (ResData.data.disTalk) {
					this.$toast("您已被禁言！")
					return false
				}
			} else {
				// this.$toast(ResData.msg)
				return false
			}
					
			let jumpUrl = `${window.location.protocol}//${window.location.host}/activity/reward/new`;
			if (this.$yryz.isNative()) {
				this.$yryz.jumpUrl({url: jumpUrl});
			} else {
				this.$router.push(`/reward/new`)
			}
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.reward_index{
	& .empty-tip {
		/*min-height: calc(100vh - 1.28rem);*/
		text-align: center;
		color: var(--text-assist-color);
		& .no-data {
			width: 3.65rem;
			height: 3.12rem;
			display: block;
			background: url(../../../../common/assets/no-data@2x.png) no-repeat;
			background-size: contain;
			margin: 1.68rem auto .4rem;
		}
	}
	& .tab_bar a {
		border-bottom: 1px solid #f1f1f1;
		& .tab_bar-item {
			height: 35px;
			padding-left: 0;
			padding-right: 0;
	    }
	}
}
</style>