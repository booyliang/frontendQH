<template>
	<!--<transition name="fade-out">-->
	<div class="article_item" v-if="!isDeleted">
		<div @click="goDetail(data)">
			<!-- <router-link :to="`general/details/${data.id}`" tag="div"> -->
			<div v-if="!isUnderCoterie">
				<y-card :title="data.nickName || data.custNname" :src="data.userImg || data.custImg" @click-img="handleClickImg(data.createUserId)" @click-name="handleClickImg(data.createUserId)"></y-card>
			</div>
			<div class="article_item-title">
				<span class="iconfont icon-set-top" v-if="data.stickFlag === 1"></span>
				<span v-html="title"></span>
			</div>
			<div class="article_item-content" v-html="content"></div>
			<y-video v-if="data.videoThumbnailUrl" preview :poster="data.videoThumbnailUrl | imageResize(3)" class="article_item-video"></y-video>
			<ul v-if="imgs.length && !data.videoThumbnailUrl" class="article_item-images">
				<li v-for="(item, index) of imgs" :key="index" class="image--responsive">
					<img :src="item | imageResize(imgs.length > 1 ? 2 : 3)" alt="">
				</li>
			</ul>
			<div class="article_item-footer">
				<div class="article_item-info">
					<template v-if="!isUnderCoterie">
						<dl>
							<dt>阅读</dt>
							<dd>{{ readNum || 0 }}</dd>
						</dl>
					</template>
					<template v-else>
						<dl>
							<dt>赞同</dt>
							<dd>{{ data.likeCount  || data.likeNum || 0 }}</dd>
						</dl>
						<dl>
							<dt>评论</dt>
							<dd>{{ data.commentCount  || data.commentNum || 0 }}</dd>
						</dl>
					</template>
					<span v-if="$route.params.coterieId">{{ data.createDate || data.createTime | recentTime }}</span>
				</div>
				<div class="article_item-menu">
					<y-tag type="warning" v-text="amount" v-if="data.contentPrice && isUnderCoterie"></y-tag>
					<div v-if="!isUnderCoterie && data.coterieName" @click.stop="goCoterie(data.coterieId)" class="article_item-text">来自私圈 {{data.coterieName}}
						<i class="iconfont icon-arrow-right"></i>
					</div>
					<div class="iconfont icon-more" :id="menuTriggerId" @click.stop v-if="showMenu"></div>
				</div>
			</div>
		</div>
		<y-menu static :menu="menu" :options="menuOptions" class="action_menu" v-if="showMenu"></y-menu>
	</div>
	<!--</transition>-->
</template>

 <script type="text/javascript">
import Card from '@/components/card';
import actiontMixin from '../mixins/action-methods'
import YVideo from '@/components/video';
import YContentSource from '@/components/content-source'
import Menu from '@/components/menu'
import Tag from './tag'
export default {
	name: 'article-item',
	mixins: [
		actiontMixin
	],
	components: {
		YVideo,
		[Menu.name]: Menu,
		[Tag.name]: Tag,
		[Card.name]: Card,
	},
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			permission: this.$coterie.permission,
			replaceData: (this.$route.query.keyword || '').replace(/\\/g, '').replace(/\//g, ''),
		}
	},
	computed: {
		showMenu() {
			return this.permission === 100 && this.isUnderCoterie;
		},
		menuTriggerId() {
			return `menu-trigger-article-${this.data.id}`
		},
		isUnderCoterie() {
			return this.$route.params.coterieId;
		},
		readNum() {
			return this.data.readNum >= 100000 ? "10万+" : this.data.readNum;
		},
		menu() {
			let menu = [
				{
					text: '置顶',
					action: () => this.handleStick(this.data)
				},
				{
					text: '取消置顶',
					action: () => this.handleUnstick(this.data)
				},
				{
					text: '收藏',
					action: () => this.handleCollect(this.data)
				},
				{
					text: '删除',
					action: () => this.handleDelete(this.data.id, '/services/app/v1/coterie/release/info/single/', 'list')
				}
			];
			let newMenu = [];
			if (this.permission === 100) {
				if (this.data.contentPrice) {
					if (this.data.stickFlag === 0) {
						newMenu.push(menu[0], menu[2])
					} else {
						newMenu.push(menu[1], menu[2])
					}
				} else {
					if (this.data.stickFlag === 0) {
						newMenu.push(menu[0], menu[2], menu[3])
					} else {
						newMenu.push(menu[1], menu[2], menu[3])
					}
				}
			}
			return newMenu;
		},
		title() {
			if (this.replaceData) {
				let reg = RegExp(this.replaceData, 'g');
				return this.data.title.replace(reg, `<span class='search-color'>${this.replaceData}</span>`)
			} else {
				return this.data.title
			}

		},
		content() {
			let content = this.data.content.substring(0, 100);
			if (this.replaceData) {
				let reg = RegExp(this.replaceData, 'g');
				return this.data.content.replace(reg, `<span class='search-color'>${this.replaceData}</span>`)
			} else {
				return content
			}
		},
		imgs() {
			let arr = [];
			if (!this.data.imgUrl) {
				return false;
			}
			arr = this.data.imgUrl.split(',');

			if (this.isUnderCoterie) {
				return arr.splice(0, arr.length > 2 ? 3 : 1);
			} else {
				return arr.splice(0, 3);
			}
			
		},
		amount() {
			return `${this.data.contentPrice / 100}悠然币阅读`;
		},
		menuOptions() {
			return {
				trigger: `#${this.menuTriggerId}`,
				transparentMask: false
			};
		}
	},
	methods: {
		goDetail(data) {
			let moduleEnum = data.moduleEnum;
			let id = data.id || data.resourceId;
			let coterieId = data.coterieId;
			if (!moduleEnum) {
				console.error(`moduleEnum is not provided.`)
				return;
			}
			if (!coterieId || coterieId === "0") {
				this.$router.push(`/redirect/${moduleEnum}/${id}`)
			} else {
				this.$router.push(`/redirect/coterie/${coterieId}/${moduleEnum}/${id}`)
			}
		},
		goCoterie(coterieId) {
			this.$router.push(`/coterie/${coterieId}`);
		},
		handleClickImg(userId) {			
			this.$yryz.toPersonalInfo({ userId: userId });
		}
	}
};
</script>

<style type="text/css">
@import "#/css/var.css";
.article_item {
	padding: var(--layout-space);
	padding-bottom: .2rem;
	position: relative;
	@apply --border-bottom;
	& .y_card {
		margin-bottom: 0.2rem;
		& .y_card-title{
			color:var(--text-assist-color);
		}
	}
	

	& .y_card .y_avatar {
		width: 0.44rem;
		height: 0.44rem;
		min-width: .44rem;
		min-height: .44rem;
		flex: 0 0 .44rem;
	}
	& .article_item-title {
		display: flex;
		margin-top: .1rem;
		font-size: .38rem;
		font-weight: 700;
		color: var(--text-primary-color);
		line-height: .4rem;
		@apply --text-cut-multi-line;
		-webkit-line-clamp: 2;
		& .icon-set-top {
			font-weight: normal;
			color: #fb4545;
			margin-right: 2px;
			font-size: .34rem;
		}
	}
	& .article_item-content {
		@apply --text-cut-multi-line;
		margin-top: .2rem;
		color: var(--text-secondary-color);
		line-height: 1.5;
		-webkit-line-clamp: 3;
	}
	& .article_item-video {
		margin-top: .3rem;
		border-radius: .12rem;
	}
	& .article_item-images {
		margin-top: 0.3rem;
		@apply --clearfix;

		&>.image--responsive {
			float: left;
			width: 32.2%;
			padding-bottom: 32.2%;
			border-radius: .12rem;
			overflow: hidden;

			&:nth-child(n+2) {
				margin-left: 1.7%;
			}
			&:only-child {
				float: none;
				width: 100%;
				padding-bottom: 44.92%;
			}
		}
	}
	& .article_item-thumb {
		width: 100%;
		max-height: 3.1rem;
		margin-top: .26rem;
		display: block;
	}
	& .article_item-footer {
		display: flex;
		justify-content: space-between;
		margin-top: .15rem;
		& .icon-more {
			margin-left: .25rem;
		}
		& .article_item-info {
			display: flex;
			font-size: .26rem;
			color: rgb(153, 153, 153);
			& dl {
				display: flex;
				flex-direction: row-reverse;
				&~dl {
					position: relative;
					margin-left: .27rem;
					&:after {
						content: "";
						position: absolute;
						top: 50%;
						left: -0.13rem;
						width: .04rem;
						height: .04rem;
						background: rgb(153, 153, 153);
						border-radius: 100%;
						transform: translateY(-50%);
					}
				}
				&:last-of-type {
					margin-right: .2rem;
				}
			}
			& dt {
				padding-left: .1rem;
			}
		}
		& .article_item-menu {
			display: flex;
			align-items: center;
			& .icon-more {
				color: var(--text-assist-color);
			}
			& .item-tag+.article_item-text {
				margin-left: .25rem;
			}
			& .action_menu {
				align-self: stretch;
			}
		}
	}
}
</style>