<template>
	<div ref="activityMain" class="platform-activity-main">
		<router-view></router-view>
		<y-modal ref="modal">
			<div class="login_modal">
				<div class="login_modal-body">
					<p class="login_modal-error_tips" v-if="errorMsg">{{ errorMsg }}</p>
					<y-input v-model="postData.phone" placeholder="请输入手机号" type="number" :maxlength="11" :show-text-length-info="false"></y-input>
					<div class="captcha" v-if="showImageCaptcha">
						<y-input v-model="imageCaptcha" placeholder="请输入图形验证码"></y-input>
						<div class="captcha_button" @click.stop="refreshImageCaptcha">
							<img :src="imageCaptchaUrl" alt="图形验证码">
						</div>
					</div>
					<div class="captcha">
						<y-input type="number" v-model="postData.verifyCode" placeholder="请输入验证码"></y-input>
						<div class="captcha_button">
							<y-button @click.native="sendCaptcha()" :disabled="inCodeCd">
								<y-countdown v-if="inCodeCd" v-model="codeCd" start @finish="handleCodeCdFinished"></y-countdown>
								<template v-else>发送验证码</template>
							</y-button>
						</div>
					</div>
					<p class="login_modal-tips">
						请提交手机号及验证码注册或者登陆，以便进行投票、参与活动等操作
					</p>
				</div>
				<div class="login_modal-footer">
					<y-button @click.native="login" class="login_modal-submit" block>
						提交
					</y-button>
				</div>
			</div>
		</y-modal>
		<y-modal ref="voteToast" class="vote_toast-modal_content">
			<div class="vote_toast_modal">
				<div class="vote_toast_modal-close" @click.stop="closeVoteToastModal">
					<i class="iconfont icon-close1"></i>
				</div>
				<div class="vote_toast_modal-icon">
					<img v-if="voteToastType === 'success'" src="../assets/vote-toast-success-icon.png">
					<img v-if="voteToastType === 'error'" src="../assets/vote-toast-error-icon.png">
				</div>
				<p class="vote_toast_modal-text">{{ voteToast.text }}</p>
				<!-- <p class="vote_toast_modal-tips">
												下载
												<a href="https://static.yryz.com/quanhu/download/index.html" target="_blank">圈乎APP</a>，加入感兴趣的圈子
												<br>3000张宜家冰雪王国门票天天抢！
											</p> -->
			</div>
		</y-modal>
	</div>
</template>

<script>
const CODE_CD = 60;
const CustIdLocalKey = 'Qh_CJSB_CustId';
const TokenLocalKey = 'Qh_CJSB_Token';
import YModal from '@/components/modal'
import YCountdown from '@/components/countdown'
import Md5 from 'md5'
import moment from 'moment'
export default {
	components: {
		YModal,
		YCountdown
	},
	data() {
		return {
			inApp: this.$yryz.isNative(),
			postData: {},
			inCodeCd: false,
			codeCd: CODE_CD,
			errorMsg: '',
			isRegister: false,
			voteToastConfig: {
				error: {
					text: '红牛提示您每个用户每日限投五票，今天投票次数已用尽',
				},
				success: {
					text: '红牛提示您投票成功！',
				}
			},
			voteToastType: 'success',
			imageCaptcha: '',
			timestamp: '',
			validaImageCaptcha: false,
			loginModalIsShow: false,

		}
	},
	watch: {
		'postData.phone'(newVal, oldVal) {
			if (newVal !== oldVal && this.showImageCaptcha) {
				this.refreshImageCaptcha();
			}
		},
		$route(to, from) {
			if (to.name !== 'detail') {
				this.$utils.setBrowserShareInfo('长江商报·红牛2017武汉大学生艺术创业大赛', '长江商报·红牛2017武汉大学生艺术创业大赛，快为你喜欢的作品投票吧！');
			}
		}
	},
	
	computed: {
		isIOS() {
			var u = navigator.userAgent, app = navigator.appVersion;
			return u.indexOf('iPhone') > -1 || !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || u.indexOf('iPad') > -1;
		},
		voteToast() {
			return this.voteToastConfig[this.voteToastType]
		},
		showImageCaptcha() {
			return this.validaImageCaptcha && this.validPhone(this.postData.phone)
		},
		imageCaptchaUrl() {
			let baseUrls = {
				'dev': 'http://api-dev.quanhu365.com',
				'mo': 'https://api-mo.quanhu365.com',
				'opus': 'https://api.quanhu365.com',
				'test': 'http://api-test.quanhu365.com',
				'localhost': 'http://api-dev.quanhu365.com'
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
		refreshImageCaptcha() {
			if (this.validPhone(this.postData.phone)) {
				this.timestamp = moment().format('x');
			} else {
				this.errorMsg = '请输入正确的手机号码';
			}
		},
		validPhone(value) {
			const regexPhone = /^((13[0-9])|(14[1456789])|(15[0-9])|166|(17[0134678])|(18[0-9])|(19[8-9]))\d{8}$/;
			return regexPhone.test(value);
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
				window.localStorage.setItem(CustIdLocalKey, userData.custId);
				window.localStorage.setItem(TokenLocalKey, userData.token);
				this.$refs['modal'].close();
			} else {
				this.refreshImageCaptcha();
				this.errorMsg = loginResData.msg;
			}
		},
		async sendCaptcha(code = '10') {
			this.errorMsg = '';
			if (!this.validPhone(this.postData.phone)) {
				this.errorMsg = '请输入正确的手机号';
				return false;
			}
			let postData = {
				chartCodeDto: '',
				phone: this.postData.phone,
				type: '1',
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
				if (captchaResData.msg === '该手机用户不存在') {
					this.sendCaptcha('1');
					return false;
				} else {
					this.refreshImageCaptcha();
					this.errorMsg = captchaResData.msg;
				}
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
		showModal() {
			this.validaImageCaptcha = false;
			if (this.$yryz.isNative()) {
				this.$user.login();
			} else {
				this.errorMsg = '';
				this.$refs['modal'].open();
				this.loginModalIsShow = true;
			}
		},
		handleCodeCdFinished() {
			this.codeCd = CODE_CD;
			this.inCodeCd = false;
		},
		showVoteToastModal(type = 'success') {
			this.voteToastType = type;
			this.$refs['voteToast'].open();
		},
		closeVoteToastModal() {
			this.$refs['voteToast'].close();
		}
	},
	mounted() {
		this.$eventBus.$on('login', this.showModal);
		this.$eventBus.$on('voteToast', this.showVoteToastModal);
		const UserId = 'mockUserId';
		const CustId = window.localStorage.getItem(CustIdLocalKey);
		const Token = window.localStorage.getItem(TokenLocalKey);
		if (Token || CustId) {
			this.$env.custId = CustId;
			this.$env.token = Token;
			this.$env.userId = UserId;
		}
		this.$utils.setBrowserShareInfo('长江商报·红牛2017武汉大学生艺术创业大赛', '长江商报·红牛2017武汉大学生艺术创业大赛，快为你喜欢的作品投票吧！');
	},
	beforeDestroy() {
		this.$eventBus.$off('login', this.showModal);
		this.$eventBus.$off('voteToast', this.showVoteToastModal);
	}	
};
</script>

<style>
@import '#/css/var.css';
.platform-activity-main {
	&.show-modal {
		/* position: relative;
		height: 100vh;
		overflow: hidden; */
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

.modal.is-ios {
	& .modal-content {
		width: 6rem;
	}
}

.vote_toast-modal_content {
	& .modal-content {
		overflow: visible;
	}
}

.vote_toast_modal {
	min-height: 4.6rem;
	width: 5.6rem;
	padding: .5rem;
	overflow: visible;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	& .vote_toast_modal-icon {
		width: 1.3rem;
		height: 1.3rem;
		margin: .1rem auto 0;
		overflow: hidden;
		& img {
			width: 100%;
		}
	}
	& .vote_toast_modal-text {
		margin-top: .3rem;
		font-size: .34rem;
		line-height: .48rem;
		text-align: center;
		color: #333;
	}
	& .vote_toast_modal-tips {
		position: relative;
		margin: .3rem -.5rem 0;
		padding-top: .3rem;
		font-size: .28rem;
		line-height: .42rem;
		color: #333;
		text-align: center;
		border-top: 1px dashed #e7e7e7;
		& a {
			font-size: .3rem;
			color: var(--theme-color);
		}
	}
	& .vote_toast_modal-close {
		position: absolute;
		top: 0;
		right: 0;
		transform: translateY(-100%);
		color: #fff;
		line-height: 1;
		& .iconfont {
			font-size: .9rem;
		}
		/* &:before {
				content: '';
				position: absolute;
				width: 1px;
				height: 1rem;
				bottom: 0;
				z-index: 1001;
				left: 50%;
				background: #fff;
				transform: translate(-50%, 100%);
			} */
	}
}
</style>
