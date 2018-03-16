<template>
	<div class="private-cicle-wrap">
		<y-nav :title="$R('private-circle')"></y-nav>
		<y-load-more-remote :request="request" @loaded="handleLoaded" :endTip="empty">
			<div v-if="empty && loaded" class="no-data">
				<img src="../../assets/no-data@2x.png" alt="">
				<div>{{$R('no-circle')}}</div>
				<div>{{$R('create-circle')}}</div>
			</div>
			<div v-else>
				<div class="circle-trip">{{$R('circle-list-trip')}}</div>
				<div v-model="checkedValues" class="check_group">
					<div :class="['check_item', {'checked': item['checked']}]" v-for="(item, index) in itemList" :key="index" @click="handleClick(item, index)">
						<i class="iconfont icon-check-b"></i>
						<div class="check_item-content">
							<img :src="item.icon">
							<span>{{item.tname}}</span>
						</div>
					</div>
				</div>
			</div>
		</y-load-more-remote>
	</div>
</template>

<script>
import YList from '@/components/list'
import YItem from '@/components/item'
import YCard from '@/components/card'
import YLoadMoreRemote from '@/components/load-more-remote'
// import YCheckGroup from '@/components/check-group'
export default {
	components: {
		YList, YItem, YCard, YLoadMoreRemote
	},

	data() {
		return {
			itemList: [],
			curItem: null,
			checkedValues: 1,
			loaded: false,
			request: {
				url: '/services/app/v1/member/im/list'
			},
		}
	},
	computed: {
		empty() {
			return this.itemList.length <= 0;
		}
	},
	mounted() {
		this.curItem = this.$localStore.get('vm');
	},
	methods: {
		handleLoaded(list, res) {
			this.itemList.push(...list);
			if (!this.empty && this.curItem) {
				this.itemList.forEach((item, index) => {
					item['checked'] = item['tid'] === this.curItem.teamId;
					if (item['tid'] === this.curItem.teamId) {
						this.itemList.splice(index, 1, item);
						this.$localStore.set('imItem', item);
					}
				})
			}
			this.loaded = true;
		},
		handleClick(currItem, index) {
			this.itemList.forEach((item, index) => {
				item['checked'] = item['tid'] === currItem['tid'];
				this.itemList.splice(index, 1, item);
			})
			this.checkedValues = this.getSelectedIds()[0];
			this.$localStore.set('imItem', currItem);
			this.$router.back();
		},
		getSelectedIds() {
			return this.getSelectedItems().map((item) => item['tid'])
		},
		getSelectedItems() {
			return this.itemList.filter((item) => item['checked'])
		},
	}
}
</script>

<style>
@import '#/css/var.css';
.private-cicle-wrap {
	& .circle-trip {
		padding: .2rem;
		color: #666;
	}
	& .check_group {
		padding: 0 .14rem;
		background: #fff;
		& .check_item {
			padding: .2rem;
			& .check_item-content {
				display: flex;
				align-items: center;
				& img {
					width: 1rem;
					height: 1rem;
					border-radius: 100%;
					margin-right: .2rem;
				}
			}
		}
	}
	& .no-data {
		text-align: center;
		margin-top: 25%;
		position: relative;
		color: #999;
		font-size: 17px;
		& img {
			width: 2.8rem;
			margin: .3rem 0;
		}
	}
}
</style>


