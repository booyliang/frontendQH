<template>
	<div class="coterie-activity-signup-wrap">
		<!--头部导航 S-->
		<y-nav :title="$R('participate-activity')">
			<span slot="nav-right">
				<y-button type="text" @click.native="onSubmit">{{$R('apply')}}</y-button>
			</span>
		</y-nav>
		<!--头部导航 E-->
		<y-verification-phone v-model="vm" class="verification-phone"></y-verification-phone>
	</div>
</template>

<script>
import { YNav } from '@/components/nav';
import YInput from '@/components/input';
import Toast from '@/components/toast';
import YButton from '@/components/button';
import VerificationPhone from '@/components/verification-phone';
import { YPublishButton, PublishMixin } from "@/components/content-publish"
export default {
	mixins: [PublishMixin],
	components: {
		Toast, YButton, YNav, YInput, YPublishButton,
		[VerificationPhone.name]: VerificationPhone,
	},
	data() {
		return {
			vm: {
				phone: this.$R('remind-phone'),
				verifyCode: this.$R('remind-verification-code'),
			},
		}
	},
	methods: {
		async onSubmit() {
			if (this.vm.phone === '' || !/^1[3|4|5|7|8|9]\d{9}$/.test(this.vm.phone)) {
				Toast(this.$R('toast-correct-phone'));
				return false;
			}
			if (this.vm.verifyCode === '') {
				Toast(this.$R('remind-verification-code'));
				return false;
			}
			let _datas = {
				phone: this.vm.phone,
				code: '3',
				verifyCode: this.vm.verifyCode
			};
			var _data = await this.$http.post('/services/app/v1/user/smsauth/check', _datas);
			if (_data.data.code !== '200' || !_data.data.data) {
				Toast('验证码输入有误');
				return false;
			}
			this.postData = {
				signupUserPhone: this.vm.phone,
				validationCode: this.vm.verifyCode,
				activityId: this.$route.params.activityId,
			}
			this.$http.post(`/services/app/v1/coterie/activity/signup`, this.postData).then(res => {
				let data = res.data;
				if (data.code === '200') {
					// this.$router.back();
					Toast('报名成功').then(res => {
						this.publishSuccess(`/coterie/${this.$route.params.coterieId}/activity/details/${this.$route.params.activityId}`);
					})
				} else if (data.code === '1107') {
					// this.$router.back();
					Toast('当前活动状态已更新，无法报名活动').then(res => {
						this.publishSuccess(`/coterie/${this.$route.params.coterieId}/activity/details/${this.$route.params.activityId}`);
					})
				} else {
					Toast(data.msg);
				}
			}).catch(msg => {
				Toast(msg);
			})
		}
	}
}
</script>

<style>
@import "#/css/var.css";

.coterie-activity-signup-wrap {
	& .verification-phone {
		margin-top: .2rem;
		/* @apply --border-bottom; */
	}
	& .y-input-wrap {
		justify-content: space-between;
		padding: .15rem 0;
		&>input {
			flex: none;
		}
	}
}
</style>
