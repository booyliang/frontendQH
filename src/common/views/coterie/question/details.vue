<template>
	<div class="question_detail">
		<y-nav title="问答详情">
			<y-button @click.native.stop="onAction" slot="nav-right" type="text" class="iconfont icon-more" v-if="showMenu && permission !== 300"></y-button>
		</y-nav>
		<div class="question_detail-content flow_detail">
			<y-user-detail-info :data="questionData"></y-user-detail-info>
			<div class="content_info">
				<div class="create_time">
					提问 {{ questionData.createDate | recentTime }}
				</div>
				<div class="info_tag">
					<y-tag type="warning" v-if="questionData.isOnlyShowMe">私密</y-tag>
					<y-tag v-if="questionData.isValid === 0">已失效</y-tag>
				</div>
			</div>
			<div class="question_content">
				<span>Q:</span>
				<y-content-source :content-source="questionData.contentSource">

				</y-content-source>
			</div>
			<div class="answer_detail" v-if="questionData.answerId">
				<div class="content_info">
					<div class="create_time">
						回答 {{ answerData.createDate | recentTime }}
					</div>
				</div>
				<div class="answer_content">
					<span>A:</span>
					<y-content-source :content-source="answerData.contentSource">
					</y-content-source>
				</div>
			</div>
		</div>
		<template v-if="questionData.answerId && !questionData.isOnlyShowMe ">
			<y-hot :hots="hots" :data="answerData"></y-hot>
			<y-comment :data="answerData"></y-comment>
			<y-bottombanner v-if="$coterie.permission === 300"></y-bottombanner>
		</template>
		<div class="button_box" v-if="!questionData.answerId && permission === 100">
			<y-button block @click.native.stop="toAnswer">去回答</y-button>
		</div>
		<div v-if="!questionData.answerId && permission !== 100 && questionData.isValid !== 0" class="answer_detail_await">耐心等待圈主答复～</div>
	</div>
</template>
<script>
import Bottombanner from '../components/bottombanner'
import YContentSource from '@/components/content-source'
import YComment from '@/components/comment/comment';
import YHot from '@/components/hot';
import YUserDetailInfo from './components/user-detail-info'
import Tag from '../components/tag'
import actiontMixin from '../mixins/action-methods';
import Dialog from '@/components/dialog'
import shareInfo from '../mixins/shareInfo';
export default {
	name: 'question-detail',
	mixins: [
		actiontMixin,
		shareInfo
	],
	components: {
		YComment,
		YHot,
		YContentSource,
		YUserDetailInfo,
		[Tag.name]: Tag,
		[Bottombanner.name]: Bottombanner,
	},
	data() {
		return {
			hots: ['forward'],
			questionData: {},
			answerData: {},
			permission: this.$coterie.permission,
			isNative: this.$yryz.isNative(),
			showMenu: false,
		}
	},
	methods: {
		toAnswer() {
			this.$router.push({ name: 'coterieQuestionAnswer', params: { questionId: this.questionData.id } })
		},
		onAction() {
			// if (!this.isNative) return;
			this.$actionsheet(this.menuData)
		},
		deleteAction(data) {
			let message = data.answerId ? '删除后将不可恢复，确定删除该内容？' : '耐心等待圈主答复，确定删除该问题？'
			let cancelText = data.answerId ? '取消' : '再想想'
			Dialog.confirm({
				message: message,
			},
				{
					okText: '确定',
					cancelText: cancelText
				}).then(() => {
					this.$http.delete(`/services/app/v1/coterie/question/single/${data.id}`).then(res => {
						if (res.data.code === '200') {
							this.$router.back()
						} else {
							this.$toast(res.data.msg)
						}
					})
				}).catch(() => {
					return false;
				})
		},
		async getQuestionData(questionId) {
			let questionRes = await this.$http.get(`/services/app/v1/coterie/question/single/${questionId}`);
			let resData = questionRes.data;
			this.questionData = resData.data;
			console.log('questionData:', this.questionData);
		},
		async getAnswerData(answerId) {
			let answerRes = await this.$http.get(`/services/app/v1/coterie/answer/single/${answerId}`);
			this.answerData = answerRes.data.data;
			console.log('answerData:', this.answerData);
		}
	},
	computed: {
		menuData() {
			let menu = [
				{
					text: '删除',
					handler: () => this.deleteAction(this.questionData)
				},
				{
					text: '收藏',
					handler: () => this.handleCollect(this.questionData)
				},
				{
					text: '取消收藏',
					handler: () => this.handleUncollect(this.questionData)
				},
				{
					text: '举报',
					handler: () => this.handleReport(this.questionData.id)
				}
			]
			let newMenu = [];
			if (this.permission === 100) {
				if (!this.questionData.answerId) {
					newMenu.push(menu[3])
				} else {
					if (this.questionData.isOnlyShowMe === 0) {
						if (this.hasCollected) {
							newMenu.push(menu[2], menu[3])
						} else {
							newMenu.push(menu[1], menu[3])
						}
					} else {
						this.showMenu = false
						// newMenu.push(menu[2])
					}
				}
			} else {
				if (this.questionData.createUserId === this.$env.userId) {
					if (!this.questionData.answerId) {
						newMenu.push(menu[0])
					} else {
						if (this.hasCollected) {
							newMenu.push(menu[2], menu[0])
						} else {
							newMenu.push(menu[1], menu[0])
						}
					}
				} else {
					if (this.hasCollected) {
						newMenu.push(menu[2], menu[3])
					} else {
						newMenu.push(menu[1], menu[3])
					}
				}
			}
			return newMenu
		}
	},
	async created() {
		let questionId, answerId;
		if (this.$route.params.questionId) {
			questionId = this.$route.params.questionId;
			await this.getQuestionData(questionId);
			answerId = this.questionData.answerId;
			if (answerId) {
				await this.getAnswerData(answerId);
			}
		} else {
			answerId = this.$route.params.answerId;
			await this.getAnswerData(answerId);
			questionId = this.answerData.questionId;
			await this.getQuestionData(questionId);
		}

		this.showMenu = this.permission === 100 && this.questionData.answerId && this.questionData.isOnlyShowMe ? false : true
		// console.log(this.questionData.answerId)
		if (answerId) {
			this.answerData.isOnlyShowMe = this.questionData.isOnlyShowMe;

			this.answerData.content = this.questionData.content; // 分享描述为问题content

			let contentSource = JSON.parse(this.answerData.contentSource);
			let audioImg = "";
			contentSource.forEach(item => {
				if (Object.keys(item)[0] === "audio") {
					audioImg = window.location.origin + "/assets/static/audio-cover@2x.png";
				}
			})
			this.answerData.imgUrl = audioImg || this.answerData.imgUrl.split(',')[0].toString();
		}
		this.$nextTick(() => {
			this.shareInfo({
				title: '圈子有了，一切都有了！',
				desc: this.questionData.content,
				imgUrl: this.answerData.imgUrl
			});
		});

		// 查询收藏状态
		if (this.isNative && this.$env.custId) {
			let checkCollectRes = await this.$http.post(`/services/app/v1/store/check`, {
				moduleEnum: this.questionData.moduleEnum,
				infoId: this.questionData.id,
				resourceId: this.questionData.resourceId
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
.question_detail {
	position: relative;
	min-height: 100vh;
	background: #fff;
	& .button_box {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 1.06rem;
		display: flex;
		align-items: center;
		padding: 0 1.15rem;
		box-shadow: 0 -2px 10px #ededed;
		& .button {
			background: #0085ff;
		}
	}
	& .answer_detail_await {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 1.05rem;
		border-top: 1px solid #ededed;
		font-size: 0.4rem;
		color: var(--text-tips-color);
		text-align: center;
		line-height: 1.05rem;
	}
	& .hot .hot-button {
		border-bottom: .2rem solid #f8f8f8;
	}
	& .comment_panel.panel--rich {
		margin-top: 0;
	}

	& .answer_content {
		line-height: .56rem;
		font-size: .36rem;
		font-weight: 700;
		overflow: hidden;
		& span {
			float: left;
		}

		& .content_source {
			margin-top: 0;
			margin-left: 0.05rem;
			float: left;
			display: inline-block;
			width: 93%;
		}
	}
}

.question_detail-content {
	padding: 0 .3rem;
	background-color: #fff;
	& .question-user_info {
		line-height: 1.07rem;
		@apply --border-bottom;
	}
	& .info_tag {
		display: flex;
	}
	& .content_info {
		display: flex;
		justify-content: space-between;
		margin-top: .4rem;
		margin-bottom: .3rem;
	}
	& .create_time {
		color: var(--text-tips-color);
		font-size: .28rem;
	}
	& .question_content {
		line-height: .56rem;
		font-size: .36rem;
		font-weight: 700;
		padding-bottom: .4rem;
		overflow: hidden;
		& span {
			float: left;
		}
		& .content_source-text {
			margin: 0;
			font-weight: normal;
		}
		& .content_source {
			margin-top: 0;
			margin-left: 0.05rem;
			float: left;
			display: inline-block;
			width: 93%;
		}
		& .content-sorce & p {
			margin: 0;
			line-height: .5rem;
			min-height: .5rem;
			color: var(--text-secondary-color);
		}
	}
	& .answer_detail {
		@apply --border-top;
		& p {
			margin: 0;
			line-height: .56rem;
			font-size: .36rem;
			font-weight: 700;
		}
	}
	& .answer_text--a {
		font-size: 0.38rem;
	}
	& .question_text--q {
		font-size: 0.34rem;
		color: var(--text-secondary-color);
		font-weight: 700;
	}
}
</style>

    