<template>
	<div class="sell-wrap">
		<y-nav :title="$R('optimmiz-merchant')" :showSearch="true" :menuData="menu"></y-nav>
	
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
				<y-mask v-if="isShowCity || isShowClassify" class="mask" @click.native="hideMask"></y-mask>
				<y-city-list v-show="isShowCity" :data="cityData" @select="getCityData"></y-city-list>
				<y-classify-select v-show="isShowClassify" :data="classifyData" @select="getClassify"></y-classify-select>
			</div>
		</div>
	
		<y-load-more-remote :request="flowRequest" @loaded="handleLoaded">
			<div class="list-container">
				<y-flow-item-sell-list v-for="(item,index) of listData" :data="item" :key="index"></y-flow-item-sell-list>
			</div>
		</y-load-more-remote>
	
		<y-button v-if="releaseFlag" class="publish-button" @click.native="handleClick"></y-button>
	</div>
</template>
<script>
import Item from '@/components/item';
import YMask from '@/components/mask';
import YBlock from '@/components/block';
import LoadMoreRemote from '@/components/load-more-remote';
import SellList from './components/sellList'
import CityList from './components/cityList';
import ClassifySelect from './components/classifySelect';
export default {
	components: {
		YMask,
		[Item.name]: Item,
		[LoadMoreRemote.name]: LoadMoreRemote,
		[SellList.name]: SellList,
		[CityList.name]: CityList,
		[ClassifySelect.name]: ClassifySelect,
	},
	data() {
		return {
			menu: ['index', {
				name: 'mysell',
				icon: 'shop-o',
				text: this.$R('my-merchant'),
				action: this.action
			}],

			releaseFlag: false,

			listData: [],

			cityData: null,
			classifyData: [],

			currentCity: this.$R('all-area'),
			currentClassify: this.$R('all-classify'),
			classifyId: null,
			isShowCity: false,
			isShowClassify: false,

			businessList: null
		}
	},
	created() {
		// console.log(this.cityData);

		// 地区列表
		this.$http.get(`/services/app/v1/business/province/list`)
			.then(res => {
				if (res.data.code === '200') {
					this.cityData = res.data.data;
					// this.$localStore.set('cityData', this.cityData);
				}
			})

		// 商家分类列表
		this.$http.get(`/services/app/v1/business/classify/list`)
			.then(res => {
				if (res.data.code === '200') {
					this.classifyData = res.data.data;
					this.$localStore.set('classifyData', this.classifyData);
				}
			})
		// 认证用户
		this.$http.get('/services/app/v1/photographer/checkStartByUserId/' + this.$circle.userId).then(response => {
			if (response.data.code === '200') {
				let _data = response.data.data;
				if (_data && _data.isAuthentication === 1) {
					this.releaseFlag = true;
					// 是否已经发布了商家信息
					this.$http.get(`/services/app/v1/business/release/check`)
						.then(res => {
							if (res.data.code === '200') {
								this.releaseFlag = res.data.data.releaseFlag === '0' ? true : false;
							}
						})
				}
			}
		})
	},
	computed: {
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
		},

		flowRequest() {
			// /services/app/v1/business/list
			// http://192.168.30.164:8888/common/services/app/v1/business/list
			return {
				url: `/services/app/v1/business/list`,
				params: {
					city: this.currentCity === this.$R('all-area') ? '' : this.currentCity,
					classifyId: this.classifyId || ''
				}
			}
		}
	},
	methods: {
		handleLoaded(list, res) {
			// console.log('res', res);
			this.listData.push(...list);
		},

		// 发布商家
		handleClick() {
			this.$router.push('/sell/new/0');
		},
		hideMask() {
			this.isShowCity = false;
			this.isShowClassify = false;
		},
		// 我的商家
		action() {
			this.$router.push('/sell/mysell');
		},

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
			// console.log(p, c);
			this.isShowCity = false;
			if ((!c && this.currentCity === this.$R('all-area')) || this.currentCity === c) return false;
			this.listData = [];
			this.currentCity = c ? c : this.$R('all-area');
		},

		getClassify(name, id) {
			// console.log(name, id);
			this.isShowClassify = false;
			if ((!name && this.currentClassify === this.$R('all-classify')) || this.currentClassify === name) return false;
			this.listData = [];
			this.currentClassify = name ? name : this.$R('all-classify');
			this.classifyId = id ? id : null;
		}
	}
}

</script>
<style>
@import '#/css/var.css';
.sell-wrap {
	& .select-item {
		position: fixed;
		width: 100%;

		& .item-data {
			& .mask {
				width: 100%;
				position: fixed;
			}
		}
	}
	& .item-bar {
		display: flex;
		flex-wrap: wrap;
		position: relative;
		z-index: 1;

		& div {
			width: 50%;
			text-align: center;
			background: #fff;
			line-height: 0.76rem;
			height: 0.76rem;
			font-size: 15px;
			@apply --border-bottom;

			& .iconfont {
				color: var(--theme-color);
				font-size: 12px;
			}
		}

		& .classify-selected,
		& .city-selected {
			color: #DC8130;
		}
	}
	& .list-container {
		margin-top: 0.76rem;
	}
}
</style>