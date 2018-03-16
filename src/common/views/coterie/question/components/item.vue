<template>
	<!--<transition name="fade-out">-->
	<div class="question_item-wrap" v-if="!isDeleted">
		<!-- <router-link tag="div" :to="{name: 'coterieQuestionDetail', params: {id: data.question.id}}" class="question_item"> -->
		<div @click="goDetail(data.question)" class="question_item">
			<y-question :data="data" :brief="true"></y-question>
			<div class="question_item-answer" v-if="data.question.answerId">
				<p class="question_item-answer-content" v-if="data.answer.contentSource">A: {{ data.answer.content }}</p>
				<div class="question_item-answer-media" :class="{'multiple': imgs.length === 3}" v-if="data.answer.answerAudio || data.answer.imgUrl">
					<template v-if="data.answer.answerAudio">
						<!-- <span v-if="!data.answer.content.trim()">A:</span> -->
						<y-audio :src="data.answer.answerAudio" :time="data.answer.audioLength || 1000"></y-audio>
					</template>
					<template v-else>
						<div class="img-item" v-for="(img, index) in imgs" :key="index">
							<img width="100%" :src="img | imageResize(imgs.length > 2 ? 2 : 3)">
						</div>
					</template>
				</div>
			</div>
			<div class="question_item-footer">
				<div class="question_item-info">
					<template v-if="!isUnderCoterie">
						<dl>
							<dt>阅读</dt>
							<dd>{{ readNum }}</dd>
						</dl>
					</template>
					<template v-else>
						<dl>
							<dt>赞同</dt>
							<dd>{{ likeNum }}</dd>
						</dl>
						<dl>
							<dt>评论</dt>
							<dd>{{ commentNum }}</dd>
						</dl>
					</template>
					<span v-if="$route.params.coterieId">{{ data.question.createDate || data.createTime | recentTime }}</span>
				</div>
				<div class="question_item-menu">
					<y-tag type="warning" v-if="data.question.isOnlyShowMe === 1">私密</y-tag>
					<y-tag v-if="data.question.isValid === 0">失效</y-tag>
					<div v-if="!isUnderCoterie && data.coterieName" @click.stop="goCoterie(data.coterieId)" class="article_item-text">来自私圈 {{data.coterieName}}
						<i class="iconfont icon-arrow-right"></i>
					</div>
					<div class="iconfont icon-more" :id="menuTriggerId" @click.stop v-if="showMenu && isUnderCoterie && permission !== 300"></div>
				</div>
			</div>
		</div>
		<y-menu static :menu="menu" :options="menuOptions" class="action_menu" v-if="showMenu && isUnderCoterie && permission !== 300"></y-menu>
	</div>
	<!--</transition>-->
</template>
<script>
import YAudio from '@/components/audio'
import YMenu from '@/components/menu';
import YQuestion from './question'
import YQuestionTag from './tag'
import Tag from '../../components/tag'
import actiontMixin from '../../mixins/action-methods'
export default {
	name: 'question-item',
	mixins: [
		actiontMixin
	],
	components: {
		YQuestion,
		YAudio,
		YMenu,
		[Tag.name]: Tag
	},
	props: {
		showInfo: {
			type: Boolean,
			default: true
		},
		data: {
			type: Object,
			default: () => { }
		}
	},
	data() {
		return {
			permission: this.$coterie.permission,
			showMenu: true
		}
	},
	created() {
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
		}
	},
	computed: {
		readNum() {
			return this.data.readNum >= 100000 ? "10万+" : this.data.readNum || 0;
		},
		likeNum() {
			// return this.data.extjson ? this.data.likeNum || 0 : this.data.answer.likeCount || 0;
			if (this.data.extjson) {
				return this.data.likeNum || 0
			} else {
				return this.data.answer ? this.data.answer.likeCount || 0 : 0
			}
		},
		commentNum() {
			// return this.data.extjson ? this.data.commentNum || 0 : this.data.answer.commentCount || 0;
			if (this.data.extjson) {
				return this.data.commentNum || 0
			} else {
				return this.data.answer ? this.data.answer.commentCount || 0 : 0
			}
		},
		isUnderCoterie() {
			return this.$route.params.coterieId;
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
					action: () => this.handleDelete(this.data.question.id, '/services/app/v1/coterie/question/single/', 'list')
				},
				{
					text: '收藏',
					action: () => this.handleCollect(this.data.question)
				},
				{
					text: '举报',
					action: () => this.handleReport(this.data.question.id)
				}
			]
			let newMenu = [];
			if (this.permission === 100) {
				if (!this.data.question.answerId) {
					if (this.data.resourceType !== '1003' && this.data.resourceType !== '1004') {
						newMenu.push(menu[4])
					} else {
						this.showMenu = false
						newMenu.push(menu[2])
					}
				} else {
					if (this.data.question.isOnlyShowMe === 0) {
						if (this.data.resourceType !== '1003' && this.data.resourceType !== '1004') {
							newMenu.push(menu[3], menu[4])
						} else {
							if (this.data.stickFlag === 0) {
								newMenu.push(menu[0], menu[3], menu[4])
							} else {
								newMenu.push(menu[1], menu[3], menu[4])
							}
						}
					} else {
						this.showMenu = false
						newMenu.push(menu[2])
					}
				}
			} else {
				if (this.data.resourceType !== '1003' && this.data.resourceType !== '1004') {
					if (this.data.question.createUserId === this.$env.userId) {
						if (!this.data.question.answerId) {
							newMenu.push(menu[2])
						} else {
							newMenu.push(menu[3], menu[2])
						}
					} else {
						this.showMenu = false
						newMenu.push(menu[2])
					}
				} else {
					this.showMenu = false
					newMenu.push(menu[2])
				}
			}
			return newMenu
		},
		menuTriggerId() {
			return `menu-trigger-question-${this.data.question.id}`;
		},
		menuOptions() {
			return {
				trigger: `#${this.menuTriggerId}`,
				transparentMask: false
			};
		},
		imgs() {
			let result = [];
			let imgUrl = this.data.answer.imgUrl;
			if (imgUrl) {
				result = imgUrl.split(',');
				let endIndex = result.length > 2 ? 3 : 1;
				return result.splice(0, endIndex);
			}
			return result;
		}
	}
}	
</script>
<style>
@import '#/css/var.css';
.question_item-wrap {
	position: relative;
	@apply --border-bottom;
	& .question_item {
		padding: .4rem .3rem .2rem;

		& .question_item-answer-content {
			@apply --text-cut-multi-line;
			margin-top: .15rem;
			line-height: 25px;
			font-size: .38rem;
			font-weight: 700;
			-webkit-line-clamp: 3;
		}
		& .question_item-answer-media {
			display: flex;
			align-items: center;
			margin-top: .2rem;
			& img {
				object-fit: cover;
				max-height: 3.1rem;
				border-radius: .12rem;
			}
			&>span {
				margin-right: .1rem;
				font-size: .38rem;
				font-weight: 700;
			}
			&.multiple {
				margin: .2rem -0.1rem 0;
				& .img-item {
					position: relative;
					width: 33.333%;
					padding: 0 .1rem 33.333%;
					height: 0;
					overflow: hidden;
					& img {
						/* padding-bottom: 100%; */
						/* height: 2.24rem; */
						/* position: absolute; */
						/* top: 0; */
						/* left: 0; */

						/* height: 35.36%; */
						/* max-height: auto; */
					}
				}
			}
		}
		& .question_item-footer {
			display: flex;
			justify-content: space-between;
			margin-top: .2rem;
		}
		& .question_item-info {
			display: flex;
			align-items: center;
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
						background: var(--text-tips-color);
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
		& .question_item-menu {
			display: flex;
			align-items: center;
			& .icon-more {
				margin-left: .25rem;
				color: var(--text-assist-color);
			}
			& .action_menu {
				align-self: stretch;
			}
		}
	}
}
</style>
