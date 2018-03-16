<template>
	<div class="coterie-publish_detail">
		<y-nav title="详情">
			<y-button @click.native.stop="onAction" slot="nav-right" type="text" class="iconfont icon-more"></y-button>
		</y-nav>
		<div class="publish_detail-content flow_detail">
			<h1 class="title">{{ detailData.title }}</h1>
			<div class="content-info">
				<p>
					<strong class="nickname" @click="clickName(detailData.createUserId)">{{ detailData.nickName }}</strong>
					<span class="create_time">{{ detailData.createDate | recentTime }}</span>
				</p>
				<span v-if="detailData.classifyItemName" class="classifyItemName iconfont icon-tag-b" @click="goPublishList()">{{detailData.classifyItemName}}</span>
			</div>
			<y-content-source class="content-source" :content-source="detailData.contentSource"></y-content-source>
		</div>
		<y-hot :hots="hots" :data="detailData"></y-hot>
		<y-comment :data="detailData"></y-comment>
	</div>
</template>
<script>
import YContentSource from '@/components/content-source'
import YComment from '@/components/comment/comment'
import YHot from '@/components/hot'
import Toast from '@/components/toast'
import actiontMixin from '@/views/coterie/mixins/action-methods';
export default {
	mixins: [
		actiontMixin
	],
	components: {
		YContentSource,
		YComment,
		YHot,
		Toast
	},
	data() {
		return {
			inApp: this.$yryz.isNative(),
			hots: ['forward'],
			detailData: {},
		}
	},
	computed: {
		menuData() {
			let menu = [{
				text: '收藏',
				handler: () => this.handleCollect(this.detailData)
			},
			{
				text: '取消收藏',
				handler: () => this.handleUncollect(this.detailData)
			},
			{
				text: '删除',
				handler: () => this.handleDelete(this.$route.params.id, '/services/app/v1/release/info/single/', 'detail')
			},
			{
				text: '举报',
				handler: () => this.handleReport(this.detailData.id)
			}
			]
			let newMenu = [];
			if (this.$env.userId === this.detailData.createUserId) {
				if (this.hasCollected) {
					newMenu.push(menu[1], menu[2])
				} else {
					newMenu.push(menu[0], menu[2])
				}
			} else {
				if (this.hasCollected) {
					newMenu.push(menu[1], menu[3])
				} else {
					newMenu.push(menu[0], menu[3])
				}
			}
			return newMenu
		}
	},
	methods: {
		onAction() {
			if (!this.inApp) return;
			this.$actionsheet(this.menuData);
		},
		clickName(userId) {
			if (!this.inApp) return;
			this.$yryz.toPersonalInfo({ userId: userId });
		},
		goPublishList() {
			if (!this.inApp) return;
			this.$router.push(`/publish/list/classifyNew/${this.detailData.classifyId}/${this.detailData.classifyItemName}/${this.detailData.classifyItemId}`)
		},

	},
	async created() {
		let articleRes = await this.$http.get(`/services/app/v1/release/info/detail/${this.$route.params.id}`);
		this.detailData = articleRes.data.data;

		// 查询收藏状态
		if (this.inApp && this.$env.custId) {
			let checkCollectRes = await this.$http.post(`/services/app/v1/store/check`, {
				moduleEnum: this.detailData.moduleEnum,
				infoId: this.detailData.id,
				resourceId: this.detailData.resourceId
			})
			if (checkCollectRes.data.code === '200') {
				this.hasCollected = checkCollectRes.data.data
			} else {
				this.$toast(checkCollectRes.data.msg);
			}
		}
	}
}	
</script>
<style>
@import '#/css/var.css';
.publish_detail-content {
	padding: 0 .3rem;
	background-color: #fff;
	overflow: hidden;
	& .title {
		margin-top: .2rem;
		line-height: 28px;
		font-size: .44rem;
		color: #000;
	}
	& .content-info {
		display: flex;
		align-items: center;
		margin-top: .3rem;
		font-size: .28rem;
		justify-content: space-between;
	}
	& .nickname {
		color: #349dff;
	}
	& .classifyItemName {
		display: block;
		padding: .07rem .15rem;
		text-align: center;
		color: #FFF;
		font-size: .24rem;
		background: #80c2ff;
		border-radius: .1rem;
	}
	& .icon-tag-b:before {
		margin-right: .1rem;
	}
	& .price {
		margin-left: .3rem;
	}
	& .create_time {
		margin-left: .2rem;
		font-size: 12px;
		color: rgb(102, 102, 102);
	}
	& .content-source {
		margin-top: .6rem;
	}
	& .unpurchased_tips {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		min-height: 3.1rem;
		margin-top: .4rem;
		border-radius: .1rem;
		background: #e5f3ff;
		color: var(--theme-color);
		font-size: 16px;
	}
	& .unpurchased_tips-logo {
		width: .8rem;
		height: 1.35rem;
		background: url("/assets/static/logo-quanhu.png") no-repeat center center;
		background-size: cover;
	}
	& .unpurchased_tips-content {
		margin-top: .44rem;
	}
}
</style>