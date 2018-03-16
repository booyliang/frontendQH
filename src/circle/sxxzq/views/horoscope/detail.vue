<template>
	<div class="horoscope-detail-wrap flow_detail">
		<y-nav :menuData="menuData" :transparent="true"></y-nav>
	
		<div class="constellation" v-if="constData">
			<img :src="constData.imgUrl" alt="" class="const-icon">
			<span>
				<p class="const-name-container">
					<span class="const-name" v-text="constData.consName"></span>
					<span class="const-date" v-text="getComstellationDate"></span>
				</p>
				<p class="detail-date">
					<span v-text="getDate"></span>
					<span v-text="getWeek"></span>
				</p>
			</span>
			<div class="bg-color"></div>
		</div>
	
		<div class="tab-container">
			<y-tab-bar v-model="tabId" :tabOption="tabOption"></y-tab-bar>
			<y-detail-item v-if="chartData" :data="chartData" :tabId="tabId"></y-detail-item>
			<div v-else class="no-data">{{$R('no-data')}}</div>
		</div>
	
		<y-panel :title="$R('read')" icon="read">
			<y-list>
				<y-item v-for="(item,index) of itemList" v-if="index<5" :key="index" :to="getLink(item)" :title="item.title" :value="item.detail.pubTime | recentTime"></y-item>
	
			</y-list>
		</y-panel>
	</div>
</template>

<script>
import { YNav } from '@/components/nav';
import Button from '@/components/button';
import YPanel from '@/components/panel';
import YItem from '@/components/item';
import YList from '@/components/list';
import Action from '@/components/comment/action';
import DetailItem from './components/detailItem'
export default {
	components: {
		YNav, YPanel, YItem, YList,
		[Button.name]: Button,
		[DetailItem.name]: DetailItem,
	},
	data() {
		return {
			menuData: [{
				icon: 'share-o',
				text: this.$R('menu-share'),
				action: this.action
			}, 'index', 'copy-url', 'report'],
			shareData: null,
			tabId: 0,
			tabOption: [
				{ id: 0, text: this.$R('today') },
				{ id: 1, text: this.$R('tomorrow') },
				{ id: 2, text: this.$R('week') },
				{ id: 3, text: this.$R('nextweek') },
				{ id: 4, text: this.$R('month') },
				{ id: 5, text: this.$R('year') },
			],
			types: ['today', 'tomorrow', 'week', 'nextweek', 'month', 'year'],
			constData: null,
			chartData: null,
			itemList: []
		}
	},

	async created() {
		let _constData = await this.$http.get('/services/app/v1/constellation/list');
		let constList = _constData.data.data
		for (let item of constList) {
			if (item.id === parseInt(this.$route.params.id)) {
				this.constData = item;
			}
		}
		this.load();

		let _itemData = await this.$http.get(`/services/app/v1/dynamic/recommend/hot/0/5`);
		this.itemList = _itemData.data.data;
	},

	watch: {
		tabId(val) {
			this.tabId = parseInt(val);
			if (this.constData) {
				this.load();
			}
		}
	},

	computed: {
		getComstellationDate() {
			return `(${this.constData.comstellationDate})`;
		},
		getDate() {
			if (!this.chartData) return '';
			return this.chartData.createDate.split(' ')[0].replace(/-/g, '.');
		},
		getWeek() {
			if (!this.chartData) return '';
			let index = new Date(this.chartData.createDate).getDay();
			let str;
			switch (index) {
				case 0:
					str = this.$R('sunday');
					break;
				case 1:
					str = this.$R('monday');
					break;
				case 2:
					str = this.$R('tuesday');
					break;
				case 3:
					str = this.$R('wednesday');
					break;
				case 4:
					str = this.$R('thursday');
					break;
				case 5:
					str = this.$R('friday');
					break;
				case 6:
					str = this.$R('saturday');
					break;
			}
			return str;
		}
	},

	methods: {
		load() {
			this.$http.get(`/services/app/v1/constellationtype/fortune/${this.constData.consName}/${this.types[parseInt(this.tabId)]}`)
				.then(res => {
					if (res.data.code === '200') {
						this.chartData = res.data.data;
						if (this.chartData === null) {
							if (this.shareData === null) {
								this.shareData = {
									title: `${this.constData.consName}${this.$R('luck')}`,
									content: '',
									imgUrl: this.constData.imgUrl,
									id: null,
									moduleEnum: '10101'
								}
							}
							return false;
						}
						if (this.shareData === null) {
							this.shareData = {
								title: `${this.constData.consName}${this.$R('luck')}`,
								content: res.data.data.wholeFortune,
								imgUrl: this.constData.imgUrl,
								id: this.chartData.id,
								moduleEnum: '10101'
							}
						}
					}
				})
		},

		getLink(item) {
			return `/redirect/${item.moduleEnum}/${item.moduleId}`;
		},

		// 分享
		action() {
			// this.chartData.moduleEnum
			Action["share"].call(this, this.shareData);
		},
	}
}
</script>

<style>
@import '#/css/var.css';
.horoscope-detail-wrap.flow_detail {
	padding: 0 0;
	& .item-wrap {
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

}

.horoscope-detail-wrap {
	background-image: url(../../assets/const-detail-bg@2x.jpg);
	background-size: contain;
	background-repeat: no-repeat;

	& .panel {
		margin: 0;
	}

	& .constellation {
		& * {
			vertical-align: middle;
		}

		& span {
			display: inline-block;
			& .const-name-container {
				color: #fff;
				margin-bottom: 0.15rem;

				& * {
					vertical-align: bottom;
				}
				& .const-name {
					font-size: 22px;
					margin-right: 0.1rem;
				}

				& .const-date {
					font-size: 14px;
				}
			}

			& .detail-date {
				font-size: 14px;
				color: #666;
				& span {
					margin-right: 0.1rem;
				}
			}
		}

		& .bg-color {
			background-color: #fff;
			height: 0.2rem;
		}

		& .const-icon {
			display: inline-block;
			width: 1.5rem;
			height: 1.5rem;
			background-size: contain;
			background-repeat: no-repeat;
			margin: 0 0.3rem;
			background-color: #fff;
			border: .04rem solid #fff;
			@apply --circle;
		}
	}
	& .tab-container {
		margin: 0.2rem 0;
		background: #fff;

		& .tab_bar {
			& a {
				padding: 0;
			}
		}

		& .no-data {
			text-align: center;
			color: #999;
			padding: 0.3rem 0;
		}
	}

	& .item-head {
		& .item-title {
			font-size: 17px;
		}
	}

	& .item-foot {
		margin-left: 0;
		margin-top: 5px;
		& .item-value {
			font-size: 12px;
			color: var(--text-assist-color);
		}
	}

	& .panel--rich {
		& .panel-title {

			& .icon-read {
				color: #FFA545;
				margin-right: 0.15rem;
			}
		}
	}

	& .item-arrow {
		display: none;
	}
}
</style>