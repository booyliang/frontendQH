<template>
	<div class="activity-new-wrap">
		<!--头部导航 S-->
		<y-nav :title="$R('participate-activity')">
			<span slot="nav-right">
				<y-publish-button>{{$R('publish')}}</y-publish-button>
			</span>
		</y-nav>
		<!--头部导航 E-->
	
		<div class="activity-new-content">
			<y-input v-model="vm.signupUserPhone" :show-text-length-info="false" :maxlength="11" :placeholder="$R('enter-contact')"></y-input>
	
			<y-input v-model="vm.signupContent" type="textarea" :minlength="4" :maxlength="100" :placeholder="$R('comment')"></y-input>
		</div>
	</div>
</template>

<script>
import { YNav } from '@/components/nav';
import YInput from '@/components/input';
import Toast from '@/components/toast';
import { YPublishButton, PublishMixin } from "@/components/content-publish"
export default {
	mixins: [PublishMixin],
	components: {
		Toast, YNav, YInput, YPublishButton
	},
	data() {
		return {
			vm: {
				signupUserPhone: '',
				signupContent: ''
			}
		}
	},
	methods: {
		/**
		 * 发布内容效验
		 */
		validate() {
			if (this.vm.signupUserPhone === '' || !/^1[3|4|5|7|8|9]\d{9}$/.test(this.vm.signupUserPhone)) {
				Toast(this.$R('toast-correct-phone'));
				return false;
			}
			if (this.vm.signupContent === '' || this.vm.signupContent.length < 4 || this.vm.signupContent.length > 100) {
				Toast(this.$R('toast-comment'));
				return false;
			}
			this.postData = {
				...this.vm,
				activityId: this.$route.params.id,
			}
		},

		/**
		 * 活动发布
		 */
		publish() {
			this.$http.post(`/services/app/v1/activitysignup/single`, this.postData).then(res => {
				let data = res.data;
				if (data.code === '200') {
					Toast(this.$R('publish-success')).then(() => {
						this.publishSuccess(`/activity/homepage/${this.$route.params.id}`);
					});
				} else if (data.code === '1107') {
					this.publishSuccess(`/activity/homepage/${this.$route.params.id}`);
				} else {
					this.publishError(data.msg);
				}
			}).catch(msg => {
				this.publishError(msg);
			})
		}
	}
}
</script>

<style>
@import "#/css/var.css";

.activity-new-wrap {
	& .activity-new-content {
		margin-top: .15rem;
	}

	& .y-input-wrap.y-textarea {
		margin-top: .2rem;
	}

	& .text-length-info {
		padding-bottom: .2rem;
	}
}
</style>
