<template>
	<div>
		<y-nav title="绑定手机号"></y-nav>
		<div class="form_tip">为了您的账户安全，请绑定手机号</div>
		<y-list>
			<y-item>
				<y-input type="tel" placeholder="请填写手机号" v-model="mobile" slot="body"></y-input>
				<y-button slot="foot" :disabled="inCodeCd" @click.native="handleSendCode" style="width: 7.5em;">
					<y-countdown v-if="inCodeCd" v-model="codeCd" start @finish="handleCodeCdFinished"></y-countdown>
					<template v-else>获取验证码</template>
				</y-button>
			</y-item>
			<y-item>
				<y-input type="number" placeholder="请填写验证码" v-model="code" slot="body"></y-input>
			</y-item>
			<y-item>
				<y-input type="password" placeholder="请填写密码" v-model="password" slot="body"></y-input>
			</y-item>
		</y-list>
		<y-button size="l" block @click.native="submit" class="submit_button">完成</y-button>
	</div>
</template>

<script type="text/javascript">
	import List from '@/components/list';
	import Countdown from '@/components/countdown';

	import md5 from 'md5';
	import Validator from '@/utils/validator';

	const CODE_CD = 60;

	export default {
		components: {
			[List.name]: List,
			[Countdown.name]: Countdown,
		},

		data() {
			return {
				mobile: '',
				code: '',
				password: '',
				inCodeCd: false,
				codeCd: CODE_CD,
				validator: new Validator({
					mobile: [
						{
							rule: 'required',
							message: '请填写手机号'
						},
						'mobile'
					],
					code: [
						{
							rule: 'required',
							message: '请填写验证码'
						}
					],
					password: [
						{
							rule: 'required',
							message: '请填写密码'
						}
					]
				})
			};
		},

		methods: {
			async handleSendCode() {
				const mobile = this.mobile;
				await this.validator.validate('mobile', mobile);
				this.inCodeCd = true;
				await this.$openApi({
					method: 'POST',
					url: '/api/v3/user/sendVerifyCode',
					data: {
						type: '1',
						phone: mobile,
						code: '8'
					}
				});
			},

			async submit() {
				await this.validator.validate([
					{
						name: 'mobile',
						value: this.mobile
					},
					{
						name: 'code',
						value: this.code
					},
					{
						name: 'password',
						value: this.password
					},
				]);

				const body = (await this.$openApi({
					method: 'POST',
					url: '/api/v3/user/bindPhoneAccount',
					data: {
						veriCode: this.code,
						phone: this.mobile,
						password: md5(this.password)
					}
				})).data;

				if (body.ret === 1) {
					this.$circle.phone = this.mobile;
					this.$router.replace(this.$route.query['from']);
				} else {
					this.$toast(body.msg);
				}
			},

			handleCodeCdFinished() {
				this.codeCd = CODE_CD;
				this.inCodeCd = false;
			},
		},
	};
</script>

<style type="text/css" scoped>
	@import "#/css/var.css";

	.item .button {
		min-height: 2.1em;
		font-size: 14px;
		margin: -0.1rem 0;
	}

	.submit_button {
		margin-top: 1rem;
	}
</style>