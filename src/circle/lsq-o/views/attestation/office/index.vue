<template>
	<div class="office-index">
		<y-nav :title="$R('office')"></y-nav>
		<div class="select-item">
			<div class="item-bar">
				<div @click="open(0)">
					<span :class="citySelected" v-text="currentCity"></span>
					<span class="iconfont" :class="iconCity"></span>
				</div>
			</div>
			<div class="item-data">
				<y-mask v-if="isShowCity || isShowClassify" class="mask" @click.native='close'></y-mask>
				<y-city-list v-show="isShowCity" :data="cityData" @select="getCityData"></y-city-list>
			</div>
		</div>
		<div class="list-container">
			<y-flow-list :request="MaskData" :item="officeList"></y-flow-list>
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
import FlowList from '@/components/flow-list';
import YCityList from '../components/cityList';
import YMask from '@/components/mask';
import officeList from '../components/officeList';
export default {
	components: {
		YNav,
		YCard,
		[Button.name]: Button,
		[LoadMoreRemote.name]: LoadMoreRemote,
		[List.name]: List,
		[Item.name]: Item,
		YCityList,
		YMask,
		officeList
	},
	data() {
		return {
			officeList: officeList,
			attachCode: 1,
			cityData: null,
			currentCity: this.$R('area'),
			isShowCity: false,
			isShowClassify: false
		}
	},
	computed: {
		MaskData() {
			return {
				method: 'get',
				url: '/services/app/v1/lawyerFirm/list',
				params: {
					pageNo: '1',
					pageSize: '10',
					lawFirmAddress: this.currentCity === this.$R('area') ? '' : this.currentCity
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
		},

		getClassify(name) {
			console.log(name);
			this.isShowClassify = false;
			this.currentClassify = name;
			// load classify data//
		},
		close() {
			this.isShowCity = false;
			this.isShowClassify = false;
		},
		handleLoaded(list, res) {
			this.dataList.push(...list);
		},
		submit() {
			// 查询认证状态
			this.$http.get(`/services/app/v1/lawyerFirm/getLawyerFirmInfoByUserId/${this.$env.userId}`).then(res => {
				this.headData = res.data.data
				console.log(res.data.data);
				if (res.data.data.isHas === 0) {
					this.$router.push({ path: '/office/edit/' + "0" })
				} else {
					this.$router.push({ path: '/office/detail/' + this.$env.userId })
				}
			});
		}
	},
	created() {
		// 地区列表
		this.$http.get("/services/app/v1/lawyer/authentication/classify/forcefields/1")
			.then(res => {
				if (res.data.code === '200') {
					this.cityData = res.data.data;
				}
			})
	}
}
</script>

<style>
@import '#/css/var.css';
.office-index {
	& .select-item {
		& .item-data {
			position: relative;
			& .city-list .province-name {
				z-index: 1;
			}
			& .city-list .city-name {
				z-index: 1
			}
		}
		& .item-bar {
			justify-content: center;
		}
	}
	& .list-container {
		margin-top: 0.86rem;
	}
	& .item-panel {
		width: 100%;
	}

	& .list {
		& .item .item-wrap {
			@apply --border-bottom;
			& .y_card {
				align-items: flex-start;
				& .y_avatar.y_card-img__large {
					width: 2rem;
					height: 1.62rem;
					min-width: 2rem;
					height: 1.62rem;

					& .y_avatar-img {
						border-radius: 0;
					}
				}

				& .y_card-text {
					flex: auto;
					&:nth-child(2) div p {
						&:first-child {
							font-size: 13px;
							color: var(--theme-color);
							margin-top: .15rem;
							margin-bottom: .15rem;
						}
					}
					& .y_card-title {
						font-size: 18px;
						color: var(--text-primary-color);
						@apply --text-cut-multi-line;
						-webkit-line-clamp: 2;
						line-height: 20px;
					}
				}
			}
		}
	}

	& .add_idea {
		width: 1.11rem;
		height: 1.1rem;
		background-image: url(../../../assets/btn_renzheng@2x.png);
		background-size: contain;
	}
}
</style>