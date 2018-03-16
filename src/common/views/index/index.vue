<template>
	<div class="index_page">
		<!-- 导航 S-->
		<y-nav :title="$circle.circleName" :showSearch="true">
		</y-nav>
		<!-- 轮播 S -->
		<y-ad :type="1" keyword="首页轮播"></y-ad>

		<!-- 私圈栏目 S-->
		<div>
			<y-panel title="精选私圈" more="/coterie-list" v-if="showCoterie">
				<div class="coterie-colum">
					<a class="coterie-item" v-for=" item in columnPage" :key="item.id" @click="gotoCoterie(item.coterieId)">
						<div>
							<img :src="item.icon" alt="">
						</div>
						<span>{{item.name}}</span>
					</a>
				</div>
			</y-panel>
		</div>

		<!--动态列表 S -->
		<div>
			<y-flow-list :request="flowRequest" :item="Item" @loaded="handleLoaded"></y-flow-list>
		</div>

		<!-- 发布按钮 S -->
		<y-publish-entry @button-clicked="handleClick">
			<span class="iconfont icon-plus"></span>
		</y-publish-entry>

	</div>
</template>
<script type="text/javascript">
import YAd from '@/components/ad';
import Item from '@/views/coterie/general/components/item';
import YLink from '@/components/link';
import PublishMixin from "@/views/publish/mixin"
import PublishEntry from '@/components/publish-entry';
export default {
	mixins: [PublishMixin],
	components: {
		YAd, Item, YLink, [PublishEntry.name]: PublishEntry,
	},
	name: 'circleIndex',
	data() {
		return {
			showCoterie: false,
			columnPage: [],
			Item: Item,
			cereateTime: ''
		}
	},
	computed: {

	},
	async created() {
		// 获取私圈列表信息
		let res = await this.$http.get('/services/app/v1/coterie/info/list/recommend')
		this.columnPage = res.data.data;
		if (res.data.data.length > 0) {
			this.showCoterie = true;
		} else {
			this.showCoterie = false;
		}

	},
	methods: {
		flowRequest(pageNo) {
			return {
				url: '/services/app/v1/circle/dynamic/list',
				params: {
					createTime: this.cereateTime,
					pageNo: pageNo,
				}
			}
		},
		handleLoaded(list, res) {
			if (list) {
				this.cereateTime = list[list.length - 1].createTime;
			}
		},
		async handleClick() {
			// 埋点
			window.zhuge.track(`[${this.$circle.circleName}]-发布按钮`, {
				'用户id': this.$env.custId, // 用户id
				'机型': this.devType, // 设备类型 Andriod ios
				'圈子名称': this.$circle.circleName, // 圈子名称
			}, function () {
				// console.log('track succeed')	
			});
			await this.$user.login();
			let res = await this.$http.get('/services/app/v1/coterie/user/checkPlatformShutup');
			if (res.data.code === '200') {
				this.start()
			} else if (res.data.code === '1023') {
				this.$toast('您已被禁言！')
			} else {
				this.$toast(res.data.msg)
			}
		},
		gotoCoterie(id) {
			this.$router.push(`/coterie/${id}`)
		},
		afterPublish(data) {
			this.$router.push(`/redirect/${data.moduleEnum}/${data.id}`)
		}
	}
}
</script>
<style>
@import "#/css/var.css";
.index_page {
	background: #fff;
	& .list {
		& .topic_item-wrap:first-of-type .topic_item {
			border-top: none;
		}
		& .item--clickable.flow_item {
			@apply --border-top;

			& .item-wrap {
				border: none;
			}
		}
	}
	& .item-wrap {
		@apply --border-top;
	}
	& .article_item,
	& .topic_item,
	& .question_item-wrap {
		@apply --border-top;
		border-bottom: none;
	}

	& .ad::after {
		display: none;
	}
	& .swiper-container-horizontal {
		height: 3.36rem;
	}

	& .panel {
		& .panel-body {
			padding: 0;
		}
		& .panel-more {
			color: #58a2ff;
		}
		& .panel-head {
			border-bottom: none;
			& .panel-title {
				font-size: .28rem;
				font-weight: 600;
			}
			& .icon-arrow-right {
				display: none;
			}
		}
	}

	& .coterie-colum {
		@apply --scrolling;
		height: 2.5rem;
		display: flex;
		&:after {
			content: 'g';
			display: block;
			width: 0.3rem;
			height: 0.65rem;
			opacity:0;
		}
		overflow-x: auto;
		& .coterie-item:nth-of-type(1) {
			margin-left: 0.3rem;
		}
		& .coterie-item {
			flex: 0 0 auto;
			width: 2.1rem;
			border: 1px solid #dfdfdf;
			background: #f9f8f8;
			margin-right: 0.15rem;
			border-radius: 0.12rem;
			text-align: center;
			color: #252525;
			font-size: .32rem;
			line-height: 1.5;
			/*box-shadow: 0 0 4px color(#000 alpha(.1));*/
			& span {
				display: block;
				width: 90%;
				margin:auto;
				overflow: hidden;
				height: 0.65rem;
				line-height: 0.65rem;
				text-align: center;
				font-weight: bold;
				padding: 0 .1rem;
				@apply --text-cut;
			}
		}

		& .coterie-item {
			& div {
				border-radius: 0.12rem 0.12rem 0 0;
				height: 1.8rem;
				width: 100%;
				display: block;
				margin: 0 auto;
				& img {
					width: 100%;
					height: 1.8rem;
					border-radius: 0.1rem 0.1rem 0 0;
					overflow: hidden;
				}
			}
		}
	}

	& .publish-btn {
		border-radius: 50%;
		width: 1.2rem;
		height: 1.2rem;
		font-size: 0.34rem;
		border: none;
		padding: 0;
		background: #0185ff;
		box-shadow: 0 0 7px rgba(0, 0, 0, .4);
		position: fixed;
		right: 0.3rem;
		bottom: 0.3rem;
		& .icon-plus {
			font-weight: bold;
			font-size: 0.56rem;
		}
		& .icon-plus:before {
			content: "\E60F";
		}
	}
	& .item-foot-child2 {
		& .icon-arrow-right {
			display: none;
		}
	}
	& .article_item-text {
		font-size: 0.26rem;
		color: var(--text-tips-color);
	}
	& .icon-arrow-right {
		font-size: .26rem !important;
	}
	& .list-item {
		& .flow_item-title {
			line-height: 1.42;
		}
	}
	& .article_item {
		& .article_item-title {
			line-height: 1.42;
		}
	}
}
</style>