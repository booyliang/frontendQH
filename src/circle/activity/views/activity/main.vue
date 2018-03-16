<template>
	<div ref="activityMain" class="platform-activity-main">
		<router-view></router-view>
		<y-modal :class="{'is-ios': isIOS}" :style="modalStyle" ref="modal">
			<div class="login_modal">
				<div class="login_modal-body">
					<p class="login_modal-error_tips" v-if="errorMsg">{{ errorMsg }}</p>
					<y-input v-model="postData.phone" placeholder="请输入手机号" type="number" :show-text-length-info="false"></y-input>
					<div class="captcha" v-if="showImageCaptcha">
						<y-input v-model="imageCaptcha" placeholder="请输入图形验证码"></y-input>
						<div class="captcha_button" @click.stop="refreshImageCaptcha">
							<img :src="imageCaptchaUrl" alt="图形验证码">
						</div>
					</div>
					<div class="captcha">
						<y-input type="number" v-model="postData.verifyCode" placeholder="请输入验证码"></y-input>
						<div class="captcha_button">
							<y-button v-if="$env.custId" @click.native="sendCaptcha(5)" :disabled="inCodeCd">
								<y-countdown v-if="inCodeCd" v-model="codeCd" start @finish="handleCodeCdFinished"></y-countdown>
								<template v-else>发送验证码</template>
							</y-button>
							<y-button v-else @click.native="sendCaptcha(10)" :disabled="inCodeCd">
								<y-countdown v-if="inCodeCd" v-model="codeCd" start @finish="handleCodeCdFinished"></y-countdown>
								<template v-else>发送验证码</template>
							</y-button>

						</div>
					</div>
					<p class="login_modal-tips">请先进行手机验证</p>
				</div>
				<div class="login_modal-footer">
					<y-button v-if="$env.custId" @click.native="bindPhone" class="login_modal-submit" block>
						提交
					</y-button>
					<y-button v-else @click.native="login" class="login_modal-submit" block>
						提交
					</y-button>
				</div>
			</div>
		</y-modal>
	</div>
</template>
<script>
const CODE_CD = 60;
const CustIdLocalKey = 'Qh_Activity_CustId';
const TokenLocalKey = 'Qh_Activity_Token';
import YModal from '@/components/modal'
import YCountdown from '@/components/countdown'
import Md5 from 'md5'
import moment from 'moment'
export default {
	name: 'activity-main',
	components: {
		YModal,
		YCountdown
	},
	data() {
		return {
			modalHeight: 0,
			modalPaddingTop: 0,
			loginModalIsShow: false,
			postData: {},
			inCodeCd: false,
			codeCd: CODE_CD,
			errorMsg: '',
			isRegister: false,
			imageCaptcha: '',
			validaImageCaptcha: false,
			timestamp: ''
		}
	},
	watch: {
		'postData.phone'(newVal, oldVal) {
			if (newVal !== oldVal && this.showImageCaptcha) {
				this.refreshImageCaptcha();
			}
		}
	},
	computed: {
		modalStyle() {
			if (!this.isIOS) return {};
			return {
				paddingTop: this.modalPaddingTop + 'px',
				height: `${this.modalHeight}px`
			}
		},
		isIOS() {
			var u = navigator.userAgent, app = navigator.appVersion;
			return u.indexOf('iPhone') > -1 || !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || u.indexOf('iPad') > -1;
		},
		showImageCaptcha() {
			return this.validaImageCaptcha && this.validPhone(this.postData.phone)
		},
		imageCaptchaUrl() {
			let baseUrls = {
				'dev': 'http://api-dev.quanhu365.com',
				'mo': 'https://api-mo.quanhu365.com',
				'm': 'https://api.quanhu365.com',
				'test': 'https://api-test.quanhu365.com',
				'localhost': 'http://api-dev.quanhu365.com',
			};
			let baseUrl = '';
			let href = window.location.href;
			let match = href.match(/([A-Za-z]+)?\./)
			if (match && match.length > 1) {
				baseUrl = baseUrls[match[1].toLowerCase()];
				baseUrl = baseUrl || baseUrls['opus']
			} else {
				baseUrl = baseUrls['localhost'] || '';
			}
			return `${baseUrl}/api/v3/component/image?phone=${this.postData.phone}&timestamp=${this.timestamp}`;
		}
	},
	methods: {
		handleRefreshActivityData(data) {
			this.postData.activityChannelCode = data.activityChannelCode;
		},
		validPhone(value) {
			if (value.length !== 11) return false;
			const regexPhone = /^((13[0-9])|(14[1456789])|(15[0-9])|166|(17[0134678])|(18[0-9])|(19[8-9]))\d{8}$/;
			return regexPhone.test(value);
		},
		refreshImageCaptcha() {
			if (this.validPhone(this.postData.phone)) {
				this.timestamp = moment().format('x');
			} else {
				this.errorMsg = '请输入正确的手机号码';
			}
		},
		validForm() {
			this.errorMsg = '';
			if (!this.validPhone(this.postData.phone)) {
				this.errorMsg = '请输入正确的手机号';
				return false;
			}
			if (this.validaImageCaptcha) {
				if (!this.imageCaptcha) {
					this.errorMsg = '请输入图形验证码';
					return false;
				}
			}
			if (!this.postData.verifyCode) {
				this.errorMsg = '请输入验证码';
				return false;
			}
		},
		async bindPhone() {
			if (this.validForm() === false) return false;
			let postData = {
				...this.postData,
				custId: this.$env.custId,
			};
			postData.veriCode = postData.verifyCode;
			let res = res = await this.$openApi.post('/api/v3/user/bindPhoneAccount', postData);
			if (res.data.ret === 3) {
				this.errorMsg = res.data.msg;
			} else if (res.data.data.check === '0') {
				this.refreshImageCaptcha();
				this.errorMsg = '验证码不正确';
			} else {
				this.$toast('绑定手机号成功！');
				this.$refs['modal'].close();
				this.$eventBus.$emit('global-message', { type: 'refresh' });
			}
		},
		async login() {
			this.errorMsg = '';
			if (this.validForm() === false) return false;
			let postData = { ...this.postData };
			let url = '/api/v3/user/loginVerifyCode';
			if (this.isRegister) {
				postData.password = Md5(`qh${String(postData.phone).substring(5)}`);
				postData.veriCode = postData.verifyCode;
				url = '/api/v3/user/register'
			}
			let loginRes = await this.$openApi.post(url, postData);
			let loginResData = loginRes.data;
			if (parseInt(loginResData.ret) === 1) {
				let userData = {
					...loginResData.data,
					userId: 'mockUserId'
				}
				this.$env.custId = userData.custId;
				this.$env.userId = userData.userId;
				this.$env.token = userData.token;
				window.sessionStorage.setItem(CustIdLocalKey, userData.custId);
				window.sessionStorage.setItem(TokenLocalKey, userData.token);
				this.$refs['modal'].close();
			} else {
				this.refreshImageCaptcha();
				this.errorMsg = loginResData.msg;
			}
		},
		async sendCaptcha(code = 10) {
			this.errorMsg = '';
			if (!this.validPhone(this.postData.phone)) {
				this.errorMsg = '请输入正确的手机号';
				return false;
			}
			let postData = {
				phone: this.postData.phone,
				type: 1,
				code: code
			}
			if (this.validaImageCaptcha) {
				if (!this.imageCaptcha) {
					this.errorMsg = '请输入图形验证码';
					return false;
				}
				postData.chartCodeDto = this.imageCaptcha;
			}
			this.inCodeCd = true;
			let capthcaRes = await this.$openApi.post('/api/v3/component/sendVerifyCode', postData);
			let captchaResData = capthcaRes.data;
			if (parseInt(captchaResData.ret) !== 1) {
				this.refreshImageCaptcha();
				this.errorMsg = captchaResData.msg;
				this.handleCodeCdFinished();
			} else {
				this.isRegister = captchaResData.data.code === '1';
				if (captchaResData.data.isSendViewCode === '1') {
					this.validaImageCaptcha = true;
					this.refreshImageCaptcha();
					this.inCodeCd = false;
				}
			}
		},
		showLoginModal(params = {}) {
			this.validaImageCaptcha = false;
			if (this.$yryz.isNative()) {
				this.$user.login();
			} else {
				this.errorMsg = '';
				this.$refs['modal'].open();
				let positionObj = this.$refs.activityMain.getBoundingClientRect();
				this.modalHeight = positionObj.height;
				this.modalPaddingTop = Math.abs(positionObj.top);
				this.loginModalIsShow = true;
			}
		},
		handleCodeCdFinished() {
			this.codeCd = CODE_CD;
			this.inCodeCd = false;
		},
	},
	created() {
		const UserId = 'mockUserId';
		const CustId = window.sessionStorage.getItem(CustIdLocalKey);
		const Token = window.sessionStorage.getItem(TokenLocalKey);
		if (Token && CustId) {
			this.$env.custId = CustId;
			this.$env.token = Token;
			this.$env.userId = UserId;
		}
	},
	mounted() {
		this.$eventBus.$on('login', this.showLoginModal);
		this.$eventBus.$on('activityDataRefresh', this.handleRefreshActivityData);
	},
	beforeDestroy() {
		this.$eventBus.$off('login', this.showLoginModal);
		this.$eventBus.$off('activityDataRefresh', this.handleRefreshActivityData);
	}
}
</script>
<style>
@import '#/css/var.css';
.platform-activity-main {
	min-height: 100vh;
	&.show-modal {
		/* position: relative;
		height: 100vh;
		overflow: hidden; */
	}
}

.modal.is-ios {
	display: block;
	position: absolute;
	& .modal-content {
		width: 6rem;
		margin: 50vh auto 0;
		transform: translateY(-50%);
	}
}

.login_modal {
	width: 6rem;
	min-height: 4.1rem;
	background: #fff;
	& .login_modal-body {
		min-height: 3.26rem;
		padding: .4rem .3rem .2rem;
		& .y-input {
			border: 1px solid #e4e4e4;
			border-radius: 0.1rem;
		}
		& .captcha {
			display: flex;
			margin-top: .2rem;
			align-items: stretch;
			& .y-input {
				border-right: none;
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			}
			& .captcha_button {
				display: flex;
				align-items: center;
				width: 2.1rem;
				flex: 0 0 2.1rem;
				border: 1px solid #e4e4e4;
				background: #f8f8f8;
				& button {
					width: 100%;
					height: .84rem;
					padding: 0;
					color: var(--theme-color);
					border-radius: 0;
					background: #f8f8f8;
				}
				& img {
					height: .84rem;
				}
			}
		}
	}
	& .login_modal-tips {
		margin-top: .2rem;
		font-size: .24rem;
		color: #aaa;
	}
	& .login_modal-error_tips {
		font-size: .24rem;
		margin-bottom: .1rem;
		color: red;
	}
	& .login_modal-submit {
		line-height: .84rem;
		width: 100%;
		max-width: 100%;
		margin: 0;
		padding: 0;
		border: none;
		background: #f8f8f8;
		color: #000;
	}
}
</style>

