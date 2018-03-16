<template>
	<div class="question_new">
		<y-nav title="提问" :beforeBack="goBack">
			<span slot="nav-right">
				<y-publish-button>发布</y-publish-button>
			</span>
		</y-nav>
		<div class="question_new-user">
			<!-- <y-card v-if="questionVm.isAnonymity" title="匿名用户" position="vertical"></y-card> -->
			<y-card  :title="$coterie.ownerName" :src="$coterie.custIcon" position="vertical"></y-card>
		</div>
		<div class="question_new-content">
			<y-editor v-model="questionVm.contentSource" :image-enable="false" :text-max-length="300" placeholder="请详细描述您要问的问题..." ref="nativeEditor"></y-editor>
			<span class="question_amount" v-if="questionVm.chargeAmount">{{questionVm.chargeAmount | priceUnit}}悠然币</span>
		</div>
		<div class="question_new-setting">
			<y-item title="回答仅自己可见">
				<y-switch slot="foot" v-model="questionVm.isOnlyShowMe"></y-switch>
			</y-item>
			<y-item title="匿名" class="anonymity-item">
				<y-switch slot="foot" v-model="questionVm.isAnonymity"></y-switch>
			</y-item>
		</div>
	</div>
</template>
<script>
	import YEditor from '@/components/content-editor'
	import YCard from '@/components/card'
	import YSwitch from '@/components/switch'
	import {
		YPublishButton,
		PublishMixin
	} from '@/components/content-publish'
	export default {
		components: {
			YCard,
			YEditor,
			YSwitch,
			YPublishButton
		},
		mixins: [PublishMixin],
		data() {
			return {
				questionVm: {
					chargeAmount: this.$coterie.consultingFee,
					contentSource: '',
					isOnlyShowMe: false,
					isAnonymity: false,
					moduleEnum: '0240',
				},
				userData: {}
			}
		},
		computed: {
			devType() { // 机型
				let devType = this.$env.devType;
				if (devType === 0) {
					return 'Andriod';
				} else if (devType === 1) {
					return 'iOS ';
				} else {
					return 'PC';
				}

			}
		},
		methods: {
			validate() {
				var summaryData = this.$refs.nativeEditor.getSummaryData();
				if (summaryData.content.length === 0) {
					this.$toast("请输入正文");
					return false;
				}
				if (summaryData.content.length < 10) {
					this.$toast("不能少于10个字");
					return false;
				}
				this.postData = {
					...this.questionVm,
					questionContent: summaryData.content,
					// coterieId: this.$route.params.coterieId,
					targetId: this.$coterie.ownerPkId
				};
				return true;
			},
			async toPay(orderId) {
				await this.$yryz.pay({
					payMoney: this.questionVm.chargeAmount,
					orderId: orderId
				});
				let res = await this.$http.get(`/services/app/v1/order/getOrderInfo/${orderId}`);
				if (res.data.data.orderState === 1) {
					// 埋点
					window.zhuge.track('私圈-提问', {
						'用户id': this.$env.custId, // 用户id
						'机型': this.devType, // 设备类型 Andriod ios
						'圈子名称': this.$circle.circleName, // 圈子名称
					}, function () {
						// console.log('track succeed')	
					});
				} else {
					throw res
				}
			},
			// 发布问题
			async publish() {
				try {
					this.postData.isOnlyShowMe = this.postData.isOnlyShowMe ? 1 : 0;
					this.postData.isAnonymity = this.postData.isAnonymity ? 0 : 1;
					
					let res = await this.$http.post('/services/app/v1/coterie/question/single', this.postData, {
						timeout: 10000
					});
					let data = res.data.data;
					if (parseInt(res.data.code) !== 200) {
						if (res.data.code === '1042') {
							this.$toast(`${res.data.errorMsg}，请重新提问`);
							await this.$coterie.getCoterieInfo(this.$route.params.coterieId);
							this.questionVm.chargeAmount = this.$coterie.consultingFee;
						} else {
							throw res;
						}
					}
					if (this.questionVm.chargeAmount) {
						await this.toPay(data.orderId);
					}
					this.$toast('发布问题成功');
					this.publishSuccess();
					window.sessionStorage.setItem('tabId', 'question');
					this.$router.back();
				} catch (err) {
					if (err.data) {
						this.$toast(err.data.msg || err.data);
					}
				}
			},
			goBack() {
				if (this.questionVm.contentSource.length > 2) {
					this.$dialog.confirm({
						title: '取消发布',
						message: '是否确认放弃编辑？',
					}, {
						okText: '是',
						cancelText: '否'
					})
					.then(() => {
						this.$router.back();
					})
					.catch(() => {
						return false;
					});
					return false;
				}
			}
		},
		created() {
			this.$http.get(`/services/app/v1/user/info/${this.$env.userId}`).then(response => {
				let resData = response.data;
				this.userData = resData.data;
			})
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.question_new {
		& .question_new-user {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 1.8rem;
			& .y_card-title {
				color: var(--text-secondary-color);
			}
		}
		& .question_new-content {
			@apply --border-top;
			position: relative;
			& .content_editor-tool {
				display: none;
			}
			& .content_editor-view {
				margin: 0;
				padding: 0;
			}
			& .y-input-wrap.y-textarea textarea {
				min-height: 4rem;
			}
			& .question_amount {
				position: absolute;
				bottom: .1rem;
				left: .3rem;
				color: var(--theme-color);
				font-size: .26rem;
			}
		}
		& .question_new-setting {
			margin-top: .2rem;
			@apply --border-top;

			& .anonymity-item {
				@apply --border-bottom;
			}
		}
	}
</style>