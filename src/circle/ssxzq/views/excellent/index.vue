<template>
	<div class='excellent'>
		<y-nav title="学校培优" :showSearch="true" :menuData="['index', 'refresh']"></y-nav>
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
		<y-flow-list :request="MaskData" :item="require('./components/schoolList')"></y-flow-list>
	</div>
</template>
<script>
	import YCityList from './components/cityList';
	import YClassifySelect from './components/classifySelect';
	import YMask from '@/components/mask';
	export default {
		components: {
			YCityList,
			YClassifySelect,
			YMask
		},
		data() {
			return {
				cityData: null,
				classifyData: [],
				currentCity: '地区',
				currentCityId: null,
				currentClassify: '小学',
				currentClassifyId: null,
				isShowCity: false,
				isShowClassify: false
			}
		},
		computed: {
			MaskData() {
				return {
					method: 'get',
					url: '/services/app/v1/school/list',
					params: {
						pageNo: 1,
						pageSize: 20,
						cityId: this.currentCityId === null ? '' : this.currentCityId,
						type: this.currentClassifyId === null ? 1 : this.currentClassifyId
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
			// 城市列表
			this.$http.get("/services/app/v1/citys/list")
				.then(res => {
					if (res.data.code === '200') {
						this.cityData = res.data.data;
					}
				})

			// 学校（机构）分类列表
			this.$http.get(`/services/app/v1/school/type`)
				.then(res => {
					if (res.data.code === '200') {
						this.classifyData = res.data.data;
					}
				})
				
			let checkedCity = this.$localStore.get('checkedCity')
			let checkedClassify = this.$localStore.get('checkedClassify')
			if (checkedCity) {
				this.currentCity = checkedCity.city
				this.currentCityId = checkedCity.id
			}
			if (checkedClassify) {
				this.currentClassify = checkedClassify.classify
				this.currentClassifyId = checkedClassify.id
			}
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
			getCityData(name, id) {
				this.isShowCity = false;
				this.currentCity = name ? name : '地区';
				this.currentCityId = id ? id : null;
				this.$localStore.set('checkedCity', {
					city: this.currentCity,
					id: this.currentCityId
				})
			},
			getClassify(name, id) {
				this.isShowClassify = false;
				this.currentClassify = name;
				this.currentClassifyId = id;
				this.$localStore.set('checkedClassify', {
					classify: this.currentClassify,
					id: this.currentClassifyId
				})
			},
			close() {
				this.isShowCity = false;
				this.isShowClassify = false;
			}
		}
	}
</script>

<style>
	@import '#/css/var.css';
	.excellent {
		min-height: 100vh;
		background: #fff;
		& .select-item {
			& .item-data{
	    		position: relative;
	    		& .city-list .province-name {
	    		  z-index:1 
	    		}
	    		& .city-list .city-name {
	    		  z-index:1 
	    		}
	    	}
			& .item-bar {
				flex-wrap: wrap;
				
				& div {
					width: 50%;
				}
			}
		}
		& .item-panel {
			width: 100%;
		}
		& .load_more {
			position: absolute;
			top: 2.18rem;
			width: 100%;
		}
	}
</style>