<template>
	<div class="medical-wrap">
		<y-nav :title="$R('doctor')+$R('hospital')" :showSearch="true" :menuData="menuData"></y-nav>
		<y-tab-bar :tabOption="tabOption" v-model="tabId" ref="tab_bar"></y-tab-bar>
	
		<y-list-selector v-if="options" :options="options" @select="getData" ref="list_selector" @open="open" :tabHeight="39"></y-list-selector>
	
		<y-load-more-remote :request="request" @loaded="handleLoaded" :class="activeClass" :style="{top: activeTop}">
			<div class="container">
				<y-medical-item v-for="(item, index) of lists" :key="index" :data="item" :tabId="tabId"></y-medical-item>
			</div>
		</y-load-more-remote>
	
	</div>
</template>
<script>
import LoadMoreRemote from '@/components/load-more-remote'
import MedicalItem from '../components/medical-item'
import ListSelector from '@/components/list-selector'
import CityData from '@/js/citydata'

export default {
	components: {
		[LoadMoreRemote.name]: LoadMoreRemote,
		[MedicalItem.name]: MedicalItem,
		[ListSelector.name]: ListSelector,
	},
	data() {
		return {
			menuData: ['index'],
			defaultField: this.$R('select-area'),
			tabId: 'doctor',
			tabOption: [
				{ id: 'doctor', text: this.$R('doctor') },
				{ id: 'hospital', text: this.$R('hospital') },
			],
			options: null,
			province: null,
			city: null,
			cityData: null,
			lists: [],
			show: false,
			activeTop: 0
		}
	},

	mounted() {
	

		// 地区列表
		this.$http.get("/services/app/v1/addr/list")
			.then(res => {
				if (res.data.code === '200') {
					this.cityData = res.data.data;
					this.options = [
						{
							type: 'area',
							defaultText: '请选择地区',
							data: res.data.data,
							listField: 'cities',
							textField: 'province'
						}
					];
					console.log(this.cityData);
				}
			})
		window.addEventListener('resize', this.setCityList);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.setCityList);
	},
	computed: {
		request() {
			return {
				url: `/services/app/v1/${this.tabId}/list`,
				params: {
					province: this.province,
					city: this.city
				}
			}
		},
		activeClass() {
			return this.show ? "activeOpen" : "close"
		}
	},
	watch: {
		// 防止滚动清空数据
		tabId() {
			this.lists = [];
		},
		options() {
			this.$nextTick(function () {
				this.setCityList();
			})
		}
	},
	methods: {
		open(evn) {
			this.show = evn;
			let Topheight = document.getElementsByClassName("load_more")[0];
			this.activeTop = this.show ? 148 + "px" : document.body.scrollTop + "px";
		},
		setCityList(evt) {
			console.log(document.body.scrollHeight);
			let list_selector = this.$refs['list_selector'];
			let tabBar = this.$refs['tab_bar'];
			let navHeight = document.getElementById('navigator').clientHeight;
			let tabBarHeight = tabBar.$el.offsetHeight;
			list_selector.$el.style.top = navHeight + tabBarHeight - 3 + 'px';
		},
		handleLoaded(list, res) {
			this.lists.push(...list);
		},
		getData(res) {
			console.log(res);
			switch (res.type) {
				case 'area':
					if (typeof res.value === "string") {	// 判断是否为null
						console.log(typeof res.value === "string");
						if (this.province === null) {
							return;
						}
					} else {
						console.log(typeof res.value);
						if (this.province === res.value[0] && this.city === res.value[1]) {
							return;
						}
					}
					this.lists = [];
					if (res.value) {
						this.province = res.value[0], this.city = res.value[1];
					} else {
						this.province = null, this.city = null;
					}
					break;
				case 'other':
					console.log(res.value);
					break;

			}
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.medical-wrap {
	& .tab_bar-item {
		font-size: 16px;
	}
	& .load_more {
		background: #fff;
		position: relative;
		& .container {
			position: relative;
			z-index: 17;
		}
	}
	& .activeOpen {
		position: fixed;
		top: 106px;
		width: 100%;
	}
	& .list-selector-wrap .select-bar-container {
		font-size: 15px;
	}
	& .list-selector-wrap .list-container .area-list {
		max-height: 80%;
		height: auto;
		& .province-list {
			position: static;
			float: left;
		}
	}
}
</style>



