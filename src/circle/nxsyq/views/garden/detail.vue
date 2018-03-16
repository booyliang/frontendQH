<template>
	<div class="garden_detail">
		<y-nav :title="$R('garden-detail')"   class="nav-demo-b" :showSearch="true"  :menuData="['index', 'refresh', 'report']">
		</y-nav>
		<y-flow-detail :data="gardenDetail"></y-flow-detail>
		<div class="garden_detail-feeling">
			<div class="feeling_title">{{$R('garden-detail-feeling')}}</div>
			<div class="feeling_body">
				<div class="feeling-item" v-for="item in feelingData">
					<y-button class="iconfont icon-star" type="text" :disabled="feelingChoosed" @click.native="chooseFeeling(item)"></y-button>
					<div class="feeling-count" v-if="feelingChoosed">{{item.feelingCount}}</div>
					<div class="feeling-label">{{item.feelingText}}</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import {YNav, YNavToggle} from '@/components/nav'
import YFlowDetail from '@/components/flow-detail'
export default {
	components: {
		YNav, YNavToggle, YFlowDetail
	},
	data() {
		return {
			gardenDetail: {
				nickName: '匿名用户',
				title: '你说什么？',
				createDate: '2017-06-06 8:22:22',
				contentSource: '[{"text": "You Don\'t Know JS"},{"image": "https://github.com/getify/You-Dont-Know-JS/raw/master/up%20%26%20going/cover.jpg"},{"text": "https://github.com/getify/You-Dont-Know-JS"}]'
			},
			feelingChoosed: false,
			feelingData: [
				{
					feelingCount: 12,
					feelingText: '感同身受',
					feelingStatus: 0,
				},
				{
					feelingCount: 23,
					feelingText: '惊呆',
					feelingStatus: 0,
				},
				{
					feelingCount: 24,
					feelingText: '路过',
					feelingStatus: 1,
				},
				{
					feelingCount: 9,
					feelingText: '早日解脱',
					feelingStatus: 0,
				}
			]
		}
	},
	methods: {
		getDetail() {
			let res = this.$http.get(`/services/app/v1/garden/detail/${this.$route.id}`);
			console.log('res', res);
			this.gardenDetail = res.data;

		},
		chooseFeeling(item) {
			console.log('item', item);
		}
	},
	created() {
		// this.getDetail();
	}
}
</script>
<style>
	.garden_detail{
		background: #fff;
		& .garden_detail-feeling{
			padding: 0.47rem 0.3rem;
			& .feeling_title {
				font-size: 15px;
				color: #333;
				text-align: center;
			}
			& .feeling_body{
				margin-top: 0.2rem;
				display: flex;
				justify-content: space-around;
				& .feeling-item{
					text-align: center;
					font-size: 14px;
					& .iconfont{
						color: #333;
					}
				}
				& .feeling-active{
					color: #fb6b90;
				}
			}
		}
	}
</style>