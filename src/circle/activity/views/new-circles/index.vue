
<template>
	<div class="new-main">
		<y-nav title="选择发布的圈子">
		</y-nav>
		<y-panel title="我发布过的圈子" v-if="dataList.length">
			<div class="all-button">
				<!-- <img v-for="(item, index) of dataList" :key="index" @click="publish(item)" :src="item.circleIcon" :alt="item.name"> -->
				<button v-for="(item, index) of dataList" :key="index" @click="publish(item)" :class="{active: selectedItem === item.appId}">{{item.circleName}}</button>
			</div>
		</y-panel>

		<y-panel title="全部圈子" v-if="Lists.length">
			<div class="all-button">
				<!-- <img v-for="(item, index) of Lists" :key="index" @click="open(item)" :src="item.circleIcon" :alt="item.name"> -->
				<button v-for="(item, index) of Lists" :key="index" @click="open(item)" class="ghost" :class="{active: currentItem === item.appId}">{{item.circleName}}</button>
			</div>
		</y-panel>
	</div>
</template>

<script>
import PublishMixin from "@/views/publish/mixin"
import Toast from '@/components/toast';
export default {
	mixins: [PublishMixin],
	data() {
		return {
			dataList: [],
			Lists: [],
			selectedItem: "",
			currentItem: ""
		}
	},
	created() {
		const postData = { limit: '', status: '0' }
		this.$openApi.post('/api/v3/circle/getCircleList', postData).then(res => {
			if (res.data.ret === 3) {
				Toast("您的网络环境开小差了");
			} else {
				this.Lists = res.data.data;
			}
		})
		// localStorage.clear();
		this.dataList = JSON.parse(localStorage.getItem("internal")) || [];
		// console.log(this.dataList);
		this.$yryz.finishLoading();
	},
	methods: {
		async publish(item) {
			this.currentItem = "";
			if (this.startPublish) {
				return;
			}
			this.startPublish = true;
			this.$env.tenantId = item.appId;
			let resData = await this.$http.get('/services/app/v1/circle/info');
			this.$env.userId = resData.data.data.userId;
			await this.start();
			this.selectedItem = item.appId;
			this.startPublish = false;
		},
		async open(item) {
			this.selectedItem = "";
			if (this.startPublish) {
				return;
			}
			this.startPublish = true;
			this.$env.tenantId = item.appId;
			let userData = await this.$http.get('/services/app/v1/circle/info');
			this.$env.userId = userData.data.data.userId

			// console.log(this.$env.tenantId + "||" + this.$env.userId);

			this.start().then(() => {
				this.dataList.map((element, index) => {
					if (element.circleName === item.circleName) {
						this.dataList.splice(index, 1);
					}
				})
				this.dataList.unshift(item);
				localStorage.setItem("internal", JSON.stringify(this.dataList));
				this.currentItem = item.appId;
				this.startPublish = false;
			});
		},
		// 更改通用配置信息
		// chagePublishData(publishData) {
		// 	console.log('this.publishData', publishData);
		// 	// publishData.config = { nmae: "xiaobu" };
		// }
	}

}
</script>

<style>
@import '#/css/var.css';
.new-main {
	& .button {
		margin: 10px 0.5% 0px 0.5%;
		flex-basis: 22%;
		font-size: 0.3rem;
	}
	& .some-button {
		background: #f3f9ff;
		color: black;
	}
	& .panel-title .iconfont {
		width: 2px;
		height: 20px;
		background: #2791f6;
	}
	& .all-button {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		& button {
			margin: 0 2% 0.3rem 0;
			width: 23%;
			height: 0.7rem;
			color: #333333;
			border-radius: 6px;
			background: #f4f4f4;
			border: 1px solid transparent;
			font-size: 0.3rem;
			&.active {
				background: #0185ff;
				color: #fff;
			}
		}
		& button:nth-child(4n) {
			margin-right: 0;
		}
		& .ghost {
			background: transparent;
			border: 1px solid #d7d7d7;
			&.active {
				background: transparent;
				border-color: #0185ff;
				color: #0185ff;
			}
		}
	}
	& .panel:first-of-type {
		margin-bottom: 0;
	}
	& .panel-head {
		border: none;
	}
	& .panel-body {
		padding-top: 0;
		padding-bottom: 0;
	}
	& .panel-title {
		font-size: 0.3rem;
		color: #000;
		font-weight: 700;
	}
}
</style>

