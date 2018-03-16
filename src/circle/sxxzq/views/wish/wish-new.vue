<template>
	<div class="wish_new">
		<!--顶部导航-->
		<y-nav :title="$R('wish-publish-w')" :beforeBack="goBack" :leftText="$R('wish-cancel')" :showLeftArrow="false">
			<span slot="nav-right">
				<y-publish-button>{{$R("wish-publish")}}</y-publish-button>
			</span>
		</y-nav>
		<!--顶部导航E-->
	
		<!--内容输入框-->
		<y-editor v-model="wishVm.contentSource" :text-max-length="200" :img-max-length="9" :placeholder="$R('wish-place')" ref="nativeEditor"></y-editor>
		<!--内容输入框E-->
		<div class="wishradio">
			<span class="iconfont icon-check-b" :class="{'icon-check-circle':anonymityFlag}" @click="anonymity()"></span>{{$R('wish-anonymity')}}</div>
	</div>
</template>
<script>
import YEditor from '@/components/content-editor'
import YButton from '@/components/button'
import Dialog from '@/components/dialog'
import YNav from '@/components/nav/nav'
import { YPublishButton, PublishMixin } from '@/components/content-publish'
export default {
	components: {
		YEditor, YButton, YNav, YPublishButton
	},
	data() {
		return {
			wishVm: {
				contentSource: '[]'
			},
			classifyId: null,
			anonymityFlag: 0
		}
	},
	mixins: [PublishMixin],
	methods: {
		validate() {
			var summaryData = this.$refs.nativeEditor.getSummaryData();
			if (summaryData.content.length === 0) {
				this.$toast(this.$R('wish-qsrzw'));
				return false;
			}
			if (summaryData.content.length < 4) {
				this.$toast(this.$R('wish-bnsysgz'));
				return false;
			}
			this.postData = {
				...this.wishVm,
				...summaryData,
				classifyId: this.classifyId,
				anonymityFlag: this.anonymityFlag
			};
		},
		// 发布许愿
		publish() {
			this.$http.post('/services/app/v1/wish/add', this.postData).then(response => {
				let data = response.data;
				if (data.code === '200') {
					this.$toast(this.$R('wish-fbcg'));
					this.publishSuccess();
					this.$router.back();
				} else {
					this.publishError(data.msg);
				}
			}).catch(error => {
				this.publishError(JSON.stringify(error));
			})
		},
		// 点击取消
		goBack() {
			if (this.wishVm.contentSource.length > 2) {
				Dialog.confirm({
					title: this.$R('wish-qxfb'),
					message: this.$R('wish-sfqrqx'),
				},
					{
						okText: this.$R('wish-ok'),
						cancelText: this.$R('wish-no')
					})
					.then(() => {
						this.$router.back();
					})
					.catch(() => {
						return false;
					});
			} else {
				this.$router.back();
			}
			return false;
		},
		anonymity() {
			this.anonymityFlag = this.anonymityFlag === 0 ? 1 : 0;
		}
	},
	mounted() {
		let id = this.$route.params.id;
		this.classifyId = parseInt(id);
	}
}
</script>
<style>
@import '#/css/var.css';
.wish_new {
	display: flex;
	flex-direction: column;
	min-height: 100vh;

	& .y-input {
		margin-top: 0.3rem;
		@apply --margin-bottom;
	}


	& .content_editor {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		& .y-textarea {
			padding-bottom: 0.1rem;
			@apply --border-bottom;
		}
	}

	& .wishradio {
		position: absolute;
		bottom: 0.3rem;
		right: 0.28rem;
		height: 0.7rem;
		line-height: 0.7rem;
		& span {
			display: inline-block;
			width: 0.5rem;
			font-size: 18px;
			color: #bfbfbf;
			position: relative;
			top: .03rem;
		}
		& .icon-check-circle {
			color: var(--theme-color);
		}
	}
}
</style>