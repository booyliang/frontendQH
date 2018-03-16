<template>
	<!--<transition name="fade-out">-->
	<div class="topic_item-wrap" v-if="!isDeleted">

		<!-- <router-link class="topic_item" :to="{name: 'coterieHome', params: {topicId: data.id}}" tag="div"> -->
		<div class="topic_item" @click="goDetail(data)">
			<div v-if="!isUnderCoterie">
				<y-card :title="data.nickName || data.custNname" :src="data.userImg || data.custImg" @click-img="handleClickImg(data.createUserId)" @click-name="handleClickImg(data.createUserId)"></y-card>
			</div>
			<div class="topic_item-title">
				<span class="iconfont icon-set-top" v-if="data.stickFlag === 1"></span>
				<span class="iconfont icon-essence" v-if="false"></span>
				<span v-html="title"></span>
			</div>
			<div class="topic_item-content" v-html="content"></div>
			<img :src="data.imgThumbnailUrl" class="topic_item-thumb" v-if="data.imgThumbnailUrl" />
			<div class="topic_item-footer">
				<div class="topic_item-info">
					<template v-if="!isUnderCoterie">
						<dl>
							<dt>阅读</dt>
							<dd>{{ readNum }}</dd>
						</dl>
					</template>
					<template v-else>
						<dl>
							<dt>阅读</dt>
							<dd>{{ data.viewCount || data.readNum || 0 }}</dd>
						</dl>
						<dl>
							<dt>讨论</dt>
							<dd>{{ data.replyCount || data.partNum || 0 }}</dd>
						</dl>
					</template>
					<span v-if="$route.params.coterieId">{{ data.createDate || data.createTime | recentTime }}</span>
				</div>
				<div v-if="!isUnderCoterie && data.coterieName" @click.stop="goCoterie(data.coterieId)" class="article_item-text">来自私圈 {{data.coterieName}}
					<i class="iconfont icon-arrow-right"></i>
				</div>
				<div class="iconfont icon-more" :id="menuTriggerId" @click.stop v-if="showMenu"></div>
			</div>
		</div>
		<y-menu static :menu="menu" :options="menuOptions" class="action_menu" v-if="showMenu"></y-menu>
	</div>
	<!--</transition>-->
</template>

<script type="text/javascript">
import Card from '@/components/card';
import actiontMixin from '../../mixins/action-methods'
import Menu from '@/components/menu'
export default {
	name: 'topic-item',
	mixins: [
		actiontMixin
	],
	components: {
		[Menu.name]: Menu,
		[Card.name]: Card,
	},
	props: {
		data: {
			type: Object,
			required: true
		},
		showInfo: {
			type: Boolean,
			default: true
		}
	},

	data() {
		return {
			replaceData: (this.$route.query.keyword || '').replace(/\\/g, '').replace(/\//g, ''),
			permission: this.$coterie.permission
		}
	},
	computed: {
		readNum() {
			return this.data.readNum >= 100000 ? "10万+" : this.data.readNum || 0;
		},
		isUnderCoterie() {
			return this.$route.params.coterieId;
		},
		showMenu() {
			return this.permission === 100 && this.isUnderCoterie;
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
					text: '删除',
					action: () => this.handleDelete(this.data.id, '/services/app/v1/coterie/topic/delete/', 'list')
				}
			];
			let newMenu = [];
			if (this.data.resourceType === '1001') {
				if (this.data.stickFlag === 0) {
					newMenu.push(menu[0], menu[2])
				} else {
					newMenu.push(menu[1], menu[2])
				}
			} else {
				newMenu.push(menu[2])
			}
			return newMenu
		},
		menuTriggerId() {
			return `menu-trigger-topic-${this.data.id}`
		},
		title() {
			if (this.replaceData) {
				let reg = RegExp(this.replaceData, 'g');
				return '#' + this.data.title.replace(reg, `<span class='search-color'>${this.replaceData}</span>`) + '#'
			} else {
				return '#' + this.data.title + '#'
			}

		},
		content() {
			if (this.replaceData) {
				let reg = RegExp(this.replaceData, 'g');
				return this.data.content.replace(reg, `<span class='search-color'>${this.replaceData}</span>`)
			} else {
				return this.data.content
			}
		},
		menuOptions() {
			return {
				trigger: `#${this.menuTriggerId}`,
				transparentMask: false
			}
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
			if (!coterieId || coterieId === "0") return;
			this.$router.push(`/redirect/coterie/${coterieId}/${moduleEnum}/${id}`);
		},
		goCoterie(coterieId) {
			this.$router.push(`/coterie/${coterieId}`);
		},
		handleClickImg(userId) {
			this.$yryz.toPersonalInfo({ userId: userId });
		}
	}
}
</script>

<style type="text/css">
@import "#/css/var.css";

.topic_item-wrap {
	position: relative;
}

.topic_item {
	padding: var(--layout-space);
	padding-bottom: .2rem;
	padding-top: 0.35rem;
	background-color: white;
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
	& .iconfont {
		font-size: .34rem;
	}
	& .icon-set-top {
		color: #fb4545;
		margin-right: 2px;
	}
	& .icon-essence {
		color: #349dff;
		margin-right: 5px;
	}
	& .topic_item-title {
		display: flex;
		font-size: .38rem;
		color: var(--text-primary-color);
		line-height: 25px;
		@apply --text-cut-multi-line;
		-webkit-line-clamp: 1;
		font-weight: bold;
	}
	& .topic_item-content {
		margin-top: 10px;
		color: var(--text-secondary-color);
		line-height: 1.5;
		@apply --text-cut-multi-line;
		-webkit-line-clamp: 3;
	}
	& .topic_item-thumb {
		width: 100%;
		max-height: 3.1rem;
		margin-top: 13px;
		border-radius: .1rem;
		display: block;
	}
	& .topic_item-footer {
		display: flex;
		justify-content: space-between;
		margin-top: .15rem;
		line-height: 20px;
	}
	& .topic_item-info {
		display: flex;
		font-size: .26rem;
		color: var(--text-tips-color);
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
					background: #999;
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
	& .icon-more {
		color: var(--text-assist-color);
		/*font-size: .4rem;*/
	}
}
</style>