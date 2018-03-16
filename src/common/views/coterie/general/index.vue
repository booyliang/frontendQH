<template>
	<div class="article-list">
		<!--<y-flow-list :request="flowRequest" :item="Item" @loaded="handleLoaded"></y-flow-list>-->
		<y-load-more-remote :request="flowRequest" :end-tip="isMember" @loaded="handleLoaded">
			<div>
				<general-item v-for="(item, index) of list" :key="index" :data="item" @stick="stick" @unstick="unstick"></general-item>
			</div>
		</y-load-more-remote>
		<y-message :icon="emptyIcon" :title="emptyTitle"></y-message>
	</div>
</template>
<script>
import Item from './components/item'
import YFlowList from '@/components/flow-list'
import Message from '@/components/message'
import LoadMoreRemote from '@/components/load-more-remote';
export default {
	components: {
		[Item.name]: Item,
		YFlowList,
		[Message.name]: Message,
		[LoadMoreRemote.name]: LoadMoreRemote
	},
	name: 'general',
	data() {
		return {
			emptyIcon: '/assets/static/status-empty@2x.png',
			Item,
			createTime: "",
			list: []
		}
	},
	async mounted() {
	},
	computed: {
		emptyTitle() {
			return this.$coterie.permission === 100 ? "还没有发布内容，赶紧去发布~" : "圈主正在准备精彩内容~";
		},
		
		isMember() {
			return [100, 200].includes(this.$coterie.permission);
		}
	},
	methods: {
		handleLoaded(list, res) {
			var timestamp = new Date().getTime();
			// console.log('timestamp', new Date().getTime());
			list.map((element, index) => {
				if (element.resourceType === '1005') {
					let _data = JSON.parse(element.extjson);
					// console.log(_data);
					let endTime = _data.signupEndDate;
					console.log(timestamp - endTime)
					if (timestamp < endTime) {
						this.list.push(element)
						// console.log('element', this.list)
					}
					// this.list.push(element)
				} else {
					this.list.push(element)
				}
			})
			if (list) {
				this.createTime = list[list.length - 1].createTime;
			}
		},
		flowRequest(pageNo) {
			return {
				url: `/services/app/v1/coterie/dynamic/list`,
				// url: '/services/app/v1/circle/dynamic/list',
				params: {
					createTime: this.createTime,
					pageNo: pageNo,
					pageSize: 10
				}
			}
		},
		stick(data) {
			for (var index in this.list) {
				if (data.infoId === this.list[index].infoId) {
					this.list.splice(index, 1)
				}
			}
			if (this.list.length) {
				this.list[0].stickFlag = 0
			}
			this.list.unshift(data)
			window.document.body.scrollTop = 0
		},
		unstick(data) {
			this.list.splice(0, 1)
			this.list.unshift(data)
		}
	}
}	
</script>
<style>
@import '#/css/var.css';
.article-list {
	& .message {
		padding: 1.2rem .3rem .2rem .3rem!important;
		display: none;
	}
	& .load_more.empty {
		& .load_more-tip {
			display: none;
		}
		&+.message {
			display: block;
		}
	}
}
</style>
    