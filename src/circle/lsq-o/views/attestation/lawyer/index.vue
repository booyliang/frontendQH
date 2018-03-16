<template>
	<div class='lsq-main'>
		<y-nav :title="$R('lawyer-title')"></y-nav>
		<div class="select-item">
			<div class="item-bar">
				<div @click="open(0)">
					<span :class="citySelected" v-text="currentCity"></span>
					<span class="iconfont" :class="iconCity"></span>
				</div>
				<div @click="open(1)">
					<span :class="classifySelected" v-text="currentClassify"></span>
					<span class="iconfont" :class="iconClassify"></span>
				</div>
			</div>
			<div class="item-data">
				<y-mask v-if="isShowCity || isShowClassify" class="mask" @click.native='close'></y-mask>
				<y-city-list v-show="isShowCity" :data="cityData" @select="getCityData"></y-city-list>
				<y-classify-select v-show="isShowClassify" :data="classifyData" @select="getClassify"></y-classify-select>
			</div>
		</div>
	
		<div class="list-container">
			<y-flow-list :request="MaskData" :item="lawyerList"></y-flow-list>
		</div>
	
		<div @click='submit' class="add_idea"></div>
	</div>
</template>

<script>
import { YNav } from '@/components/nav';
import Button from '@/components/button';
import LoadMoreRemote from '@/components/load-more-remote';
import List from '@/components/list';
import Item from '@/components/item';
import YCard from '@/components/card';
import YCityList from '../components/cityList';
import YClassifySelect from '../components/classifySelect';
import YMask from '@/components/mask';
import FlowList from '@/components/flow-list';
import lawyerList from '../components/lawyerList'
export default {
	components: {
		YNav,
		YCard,
		[Button.name]: Button,
		[LoadMoreRemote.name]: LoadMoreRemote,
		[List.name]: List,
		[Item.name]: Item,
		[FlowList.name]: FlowList,
		YCityList,
		YClassifySelect,
		YMask,
		lawyerList
	},
	data() {
		return {
			lawyerList: lawyerList,
			dataList: [],
			request: {
				method: 'get',
				url: '/services/app/v1/lawyer/authentication/list',
			},
			attachCode: 1,
			cityData: null,
			classifyData: [],

			currentCity: this.$R('area'),
			currentClassify: this.$R('field'),
			isShowCity: false,
			isShowClassify: false
		}
	},
	computed: {
		MaskData() {
			return {
				method: 'get',
				url: '/services/app/v1/lawyer/authentication/list',
				params: {
					pageNo: '1',
					pageSize: '10',
					location: this.currentCity === this.$R('area') ? '' : this.currentCity,
					goodField: this.currentClassify === this.$R('field') ? '' : this.currentClassify
				}
			}
		},
		citySelected() {
			return this.isShowCity ? 'city-selected' : '';
		},
		classifySelected() {
			return this.isShowClassify ? 'classify-selected' : '';
		},
		iconCity() {
			return this.isShowCity ? 'icon-arrow-up' : 'icon-arrow-down';
		},
		iconClassify() {
			return this.isShowClassify ? 'icon-arrow-up' : 'icon-arrow-down';
		}
	},
	mounted() {
		// this.cityList();
		// 地区列表
		this.$http.get("/services/app/v1/lawyer/authentication/classify/forcefields/1")
			.then(res => {
				if (res.data.code === '200') {
					this.cityData = res.data.data;
				}
			})

		// 分类列表
		this.$http(`/services/app/v1/lawyer/authentication/classify/childFields/2`)
			.then(res => {
				if (res.data.code === '200') {
					this.classifyData = res.data.data;
				}
			})
	},
	methods: {
		open(id) {
			if (id === 0) {
				this.isShowCity = !this.isShowCity;
				if (this.isShowCity) this.isShowClassify = false;
			} else if (id === 1) {
				this.isShowClassify = !this.isShowClassify;
				if (this.isShowClassify) this.isShowCity = false;
			}
		},
		getCityData(p, c) {
			console.log(p, c);
			this.isShowCity = false;
			this.currentCity = c ? c : this.$R('area');
			// load city data...
			this.currentClassify = this.$R('field');
		},

		getClassify(name) {
			console.log(name);
			this.isShowClassify = false;
			this.currentClassify = name ? name : this.$R('field');
			this.currentCity = this.$R('area');
			// load classify data//
		},
		close() {
			this.isShowCity = false;
			this.isShowClassify = false;
		},
		//			handleLoaded(list, res) {
		//				this.dataList.push(...list);
		//			},
		submit() {
			// 查询认证状态  authstatus(认证(0未审核，1审核通过，2审核不通过)) || recordCount(0没有申请律师认证，大于0申请过律师认证)
			this.$http.get("/services/app/v1/lawyer/authentication/authstatus/" + this.$env.userId).then(res => {
				this.headData = res.data.data
				if (res.data.code === "200") {
					// console.log('验证状态返回【审核状态】||【申请状态】', this.headData.authstatus + '||' + this.headData.recordCount);
					if (this.headData.recordCount === 0) {
						this.$router.push({
							path: '/lawyer/edit/' + this.headData.recordCount
						})
						return false;
					} else if (this.headData.recordCount > 0 && this.headData.authstatus === 0 || this.headData.authstatus === 1 || this.headData.authstatus === 2 || this.headData.authstatus === 3) {
						this.$router.push({
							path: '/lawyer/detail/' + this.$env.userId
						})
					}
				}
			});
		}
	}
}
</script>

<style>
@import '#/css/var.css';
.lsq-main {
	& .select-item {
		& .item-data {
			position: relative;
			& .city-list .province-name {
				z-index: 1
			}
			& .city-list .city-name {
				z-index: 1
			}
		}
		& .item-bar {
			flex-wrap: wrap;

			& div {
				width: 50%;
			}
		}
	}
	& .item-wrap {
		@apply --border-bottom;
	}
	& .y_card {
		& .y_card-text {
			& div:nth-child(2) {
				& p:first-child {
					font-size: 13px;
					color: var(--text-assist-color);
					margin: .07rem 0 .1rem 0;
				}
				& p:last-child {
					font-size: 14px;
				}
			}
			& .y_card-title {
				font-size: 17px;
				color: #183883;
			}
		}
	}
	& .list-container {
		margin-top: 0.86rem;
	}
	& .item-panel {
		width: 100%;
	}
}
</style>