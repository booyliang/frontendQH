<template>
	<div class="reward-box">
		<y-nav :show-background="true" title="中奖记录">
		</y-nav>
		<y-tab-bar v-model="tabId" :tabOption="tabOption"></y-tab-bar>
		<y-load-more :state="state" @can-load="onCanLoad" :endTip="!empty" :class="`tab${tabId}-list`">
			<div>
				<template v-if="tabId === '1'">
					<div class="all-record" v-for="(item, index) in lotteryData" :key="index">
						<span>{{item.custName}} </span>获得
						<span> {{item.lotName}}</span>
					</div>
				</template>
				<div v-if="tabId === '2'">
					<div class="my-record-bi" v-for="(mItem, index) in lotteryData" :key="index">
						<div class="rt">已转入您的消费账户</div>
						<div>获得
							<span>{{mItem.lotName}}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="no-reward-wrap" v-if="empty">
				<div class="not-found-img"></div>
				<p v-if="tabId == '1'">暂无数据</p>
				<p v-if="tabId === '2'">您还没有中奖噢~</p>
				<p v-if="tabId === '2'">再接再厉！</p>
			</div>
		</y-load-more>

	</div>
</template>
<script>
import LoadMore from '@/components/load-more';
import Api from './api'
import { YTabBar, YTabContainer, YTabContainerItem } from '@/components/tab'
export default {
	components: {
		[LoadMore.name]: LoadMore,
	},
	data() {
		return {
			custId: '',
			tabId: this.$route.params['tabId'] || '1',
			lotteryData: [], // 获奖数据
			tabOption: [{ id: '1', text: '全部' }, { id: '2', text: '我的' }],
			loaded: false,
			state: undefined,
			limit: 50,
			time: '',
		}
	},
	created() {
		if (!this.$env.custId) return;
		this.postData();
	},
	computed: {
		empty() {
			return this.loaded && !this.lotteryData.length;
		}
	},
	methods: {
		onCanLoad() {
			this.postData();
		},
		postData() {
			if (this.state === 'loading')
				return;
			let params = null;
			if (this.tabId === '1') {
				params = {
					limit: this.limit,
					time: this.time,
				}
			} else {
				params = {
					custId: this.tabId === '1' ? '' : this.$env.custId,
					limit: this.limit,
					time: this.time,
				}
			}
			this.state = 'loading';
			Api.getLogList(params).then((res) => {
				if (res.data.ret === 1) {
					this.loaded = true;
					let data = res.data.data || [];
					console.log(data.length, this.limit)
					if (data.length < this.limit) {
						this.state = "end";
					} else {
						this.time = data[data.length - 1].createTime || '';
						this.state = "prepared";
					}
					this.lotteryData.push(...data);

				} else {
					console.log(res.data.msg);
				}
			});
		},
	},
	watch: {
		tabId(newVal) {
			this.loaded = false;
			this.state = undefined,
			this.lotteryData = [];
			this.time = '';
			this.postData();
		},
	}
}
</script>
<style>
@import "#/css/var.css";
.reward-box {
	background: #fff;
	min-height: 100vh;
	& .tab_bar-item.active {
		color: #0185ff;
		border-bottom-color: #0185ff;
		font-weight: 600;
		height: 35px;
		padding-left: 0;
		padding-right: 0;
	}
	& .all-record {
		padding: 0 0.4rem;
		line-height: 1rem;
		border-bottom: 1px solid #f4f4f4;
		font-size: 0.32rem;
		color: #000;
	}
	& .my-record-bi {
		padding: 0rem 0.4rem;
		line-height: 1rem;
		font-size: 0.32rem;
		border-bottom: 1px solid #f4f4f4;
		color: #000;
	}
	& .all-record span {
		color: #0185ff;
	}
	& .my-record-bi span {
		color: #0185ff;
	}
	& .rt {
		float: right;
		color: #666;
		font-size: 0.26rem;
	}
	& .no-reward-wrap .not-found-img {
		background-image: url(../../assets/no-data@2x.png);
		background-size: cover;
		width: 3.64rem;
		height: 3.12rem;
		margin: 1.5rem auto 0.4rem auto;
	}
	& .no-reward-wrap p {
		text-align: center;
		color: #666;
	}
}
</style>
