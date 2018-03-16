<template>
	<div class="platform_signup">
		<div class="signup-container">
			<div class="form-item picon picon-phone">
				<input type="text" class="input" v-model="phone" placeholder="请输入手机号" maxlength="11">
			</div>
			<div class="form-item has_right picon picon-img" v-if="showImageCaptcha">
				<input type="text" class="input" v-model="picCode" placeholder="请输入图形验证码">
				<div class="form-item--right vcode_img" @click="refreshImageCaptcha">
					<img height="100%" :src="imageCaptcha" />
				</div>
			</div>
			<div class="form-item has_right picon picon-shield">
				<input type="text" class="input" v-model="vCode" placeholder="请输入验证码" maxlength="6">
				<button class="form-item--right btn-link" @click="getCode" :disabled="inCodeCd">
					<y-countdown v-if="inCodeCd" v-model="codeCD" start @finish="handleCodeCdFinished"></y-countdown>
					<template v-else>
						{{btnText}}
					</template>
				</button>
			</div>
			<div class="btn-container">
				<a class="btn" @click="handleSubmit">立即领取积分</a>
			</div>
			<p class="text-yellow">如何使用积分</p>
			<p class="text-white">1.新用户输入手机号平分积分。</p>
			<p class="text-white">2.下载圈乎APP，完成登录即可使用积分！</p>
			<p class="text-white">3.每个手机号只能参与平分1次。</p>
		</div>
	</div>
</template>
<script>
	import MD5 from 'md5'
	import Moment from 'moment'
	import YCountdown from '@/components/countdown'
	const CaptchaCD = 60;
	export default {
		components: {
			YCountdown
		},
		data() {
			return {
				codeCD: CaptchaCD,
				inCodeCd: false,
				phone: '',
				picCode: '',
				vCode: '',
				vCodeImg: '',
				disabled: {
					getCodeBtn: false,
					submitBtn: false
				},
				btnText: '获取验证码',
				imageCaptchaTime: Moment().format('x'),
				isSendViewCode: false,
			}
		},
		computed: {
			imageCaptcha() {
				let baseUrls = {
					'dev': 'http://api-dev.quanhu365.com',
					'mo': 'https://api-mo.quanhu365.com',
					'm': 'https://api.quanhu365.com',
					'test': 'https://api-test.quanhu365.com',
					'localhost': 'http://api-dev.quanhu365.com',
				};
				let match = window.location.href.match(/([A-Za-z]+)?\./);
				let baseUrl = '';
				if (match && match.length > 1) {
					baseUrl = baseUrls[match[1].toLowerCase()];
					baseUrl = baseUrl || baseUrls['m']
				} else {
					baseUrl = baseUrls['localhost'] || '';
				}
				return `${baseUrl}/api/v3/component/image?phone=${this.phone}&time=${this.imageCaptchaTime}`
			},
			showImageCaptcha() {
				return this.verifyPhone(false) && this.isSendViewCode;
			}
		},
		methods: {
			handleCodeCdFinished() {
				this.codeCD = CaptchaCD;
				this.inCodeCd = false;
			},
			refreshImageCaptcha() {
				if (this.verifyPhone()) {
					this.imageCaptchaTime = Moment().format('x');
				}
			},
			validate() {
				if (!this.phone) {
					this.$toast('请输入手机号');
					return false;
				}
				if (!this.$picForm.hasClass('hidden') && !this.picCode) {
					this.$toast('请输入图形验证码');
					return false;
				}
				if (!this.$vCode.val()) {
					this.$toast('请输入验证码');
					return false;
				}
			},
			verifyPhone(toast = true) {
				let reg = /^((13[0-9])|(14[1456789])|(15[0-9])|166|(17[0134678])|(18[0-9])|(19[8-9]))\d{8}$/;
				if (reg.test(this.phone) && this.phone.length === 11) {
					return true;
				} else if (toast) {
					this.$toast('请输入正确的手机号');
					return false;
				}
			},
			getCode() {
				if (!this.phone) {
					this.$toast('请输入手机号');
					return false;
				}
				if (!this.verifyPhone()) {
					return;
				}
				this.inCodeCd = true;
				let postData = {
					"phone": this.phone,
					"code": '1',
					"type": "1"
				}
				if (this.isSendViewCode) {
					postData.chartCodeDto = this.picCode;
				}
				this.$openApi.post('/api/v3/component/sendVerifyCode', postData).then(res => {
					let resData = res.data;
					if (resData.ret === 1) {
						if (parseInt(resData.data.isSendViewCode) === 1) {
							this.isSendViewCode = true;
							this.refreshImageCaptcha();
							this.handleCodeCdFinished();
						}
					} else {
						this.$toast(resData.msg);
						this.refreshImageCaptcha();
						this.handleCodeCdFinished();
					}
				}).catch(() => {
					this.refreshImageCaptcha();
					this.handleCodeCdFinished();
				})
			},
			handleSubmit() {
				if (!this.verifyPhone()) {
					return;
				}
				if (!this.vCode) {
					this.$toast('请输入验证码！');
					return;
				}
				let password = `qh${String(this.phone).substring(5)}`;
				let postData = {
					inviter: this.$route.query.inviter,
					password: MD5(password),
					phone: this.phone,
					veriCode: this.vCode
				};
				this.$openApi.post('/api/v3/user/register', postData).then(res => {
					let resData = res.data;
					if (resData.msg === 'success') {
						this.$router.replace({
							name: 'platformSignupSuccess',
							query: {
								phone: resData.data.custPhone
							}
						})
					} else {
						this.$toast(resData.msg);
					}
				})
			},
		}
	}
</script>
<style>
	@import "#/css/var.css";
	.platform_signup {
		height: 100vh;
		background: #232779 url('../../assets/bg.png') center bottom no-repeat;
		background-size: 100% auto;
		min-height: 11rem;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		& .signup-container {
			position: relative;
			padding-bottom: .3rem;
			margin-left: 1.2rem;
			width: 5.76rem;
			height: 6.45rem;
			text-align: center;
			& p {
				text-align: left;
				font-size: .26rem;
			}
		}
		& .form-item {
			position: relative;
			width: 5.76rem;
			border: 0.2rem solid #284e9c;
			border-left: 0;
			border-bottom-width: 0.15rem;
			background-color: #284e9c;
			&:nth-child(3) {
				border-bottom-width: 0.2rem;
			}
		}

		& .form-item:last-child {
			border-bottom-width: 0.2rem;
		}
		& .hidden {
			display: none;
		}
		& .form-item:last-child {
			border-bottom-width: 0.2rem;
		}
		& .form-item.has_right .input {
			padding-right: 2rem;
		}
		& .form-item.has_right .form-item--right {
			position: absolute;
			right: 5px;
			top: 50%;
			transform: translateY(-50%);
		}
		& .form-item.has_right .vcode_img {
			display: block;
			width: 1.5rem;
			height: 0.7rem;
			background-color: #eee;
		}
		& .input {
			display: block;
			width: 100%;
			height: 0.88rem;
			padding: 0.1rem;
			padding-left: 0.8rem;
			border: 0;
			box-shadow: none;
			color: #fff;
			font-size: 0.32rem;
			background-color: #407dd7;
			border-radius: 0.1rem;
		}

		& .input::-webkit-input-placeholder {
			color: #ffffff;
			opacity: .6;
		}

		& .btn-container {
			margin-bottom: 0.4rem;
			margin-left: -0.55rem;
		}

		& .btn {
			width: 3.96rem;
			display: inline-block;
			padding: 0.2rem;
			margin-top: 0.2rem;
			border-radius: 0.8rem;
			background-color: #f8654f;
			color: #fff;
			font-size: .36rem;
			line-height: 1;
			text-align: center;
		}
		& .btn-link {
			display: inline-block;
			padding: 0.12rem;
			color: #fff158;
			text-decoration: underline;
			background: transparent;
			border: 0;
			box-shadow: none;
			outline: none;
		}
		& .form-item.picon::after {
			content: '';
			width: 0.42rem;
			height: 0.42rem;
			position: absolute;
			left: 0.2rem;
			top: 50%;
			margin-top: -0.21rem;
		}

		& .picon.picon-phone::after {
			background: url('../../assets/icon-phone.png') center no-repeat;
			background-size: 100% auto;
		}

		& .picon.picon-img::after {
			background: url('../../assets/icon-img.png') center no-repeat;
			background-size: 100% auto;
		}

		& .picon.picon-shield::after {
			background: url('../../assets/icon-shield.png') center no-repeat;
			background-size: 100% auto;
		}
		& .text-yellow {
			color: #fff158;
			font-size: 0.32rem;
		}
		& .text-white {
			color: #fff;
		}
	}
</style>