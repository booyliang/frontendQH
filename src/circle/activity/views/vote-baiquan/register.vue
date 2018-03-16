<template>
	<div class="account" :class="{'unNative': !this.$yryz.isNative()}">
		<div class="cover">
			<y-nav :transparent="true" v-if="this.$yryz.isNative()" ></y-nav>
		</div>
		
		<y-item>
			<y-input v-model="phone" :autofocus='true' type='number' :maxlength='11' :disabled='PhoneDisabled' placeholder="请输入手机号码" :show-text-length-info="false"></y-input>
		</y-item>
		
		<y-item>
			<y-input v-model='verifyCode' :maxlength='6' placeholder="请输入验证码" :show-text-length-info="false">
				<y-button slot='right' type='span' :disabled='PhoneDisabled'  @click.native='regSendCode'>{{securityCode}}</y-button>
			</y-input>
		</y-item>
		<y-item>
			<y-input v-model="password" :autofocus='true' :type='pwdType' :maxlength='18'  placeholder="设置登录密码（6~18位数字+字母组合）" :show-text-length-info="false">
				<span slot="right" class="seePassword" :class="{ 'show': canSee }" @click="seePassword"></span>
			</y-input>
			
		</y-item>
		<y-button  block @click.native="submit" class="account-ok-btn">立即领取</y-button>

		<div class="old-user-tips">老用户请在App中参与活动！</div>


	</div>
</template>
<script>
import YNav from '@/components/nav/nav';
import Item from '@/components/item';
import YInput from '@/components/input';
import Md5 from "../../js/md5.js"; // md5
export default {
	components: {
		[YNav.name]: YNav,
		[Item.name]: Item,
		[YInput.name]: YInput,
	},
	data() {
		return {
			securityCode: '发送验证码',
			PhoneDisabled: false,
			phone: '',
			verifyCode: '',
			password: '',
			pwdType: 'password',
			canSee: false,
		}
	},
	methods: {
		seePassword() { // 查看密码
			this.canSee = !this.canSee;
			if (this.canSee) {
				this.pwdType = "text";
			} else {
				this.pwdType = "password";
			}
		},
		regSendCode() { // 发送验证码
		
			if (this.phone === '' || !/^1[3|4|5|7|8|9]\d{9}$/.test(this.phone)) {
				return this.$toast('手机号输入有误！')
			}
			if (this.PhoneDisabled) return;
			// console.log(this.$openApi)
			// 发送验证码接口
			this.$openApi.post('/api/v3/user/sendVerifyCode', {"phone": this.phone, "code": '1', "type": "1"}).then((res) => {
				if (res.data.ret === 2) { // 改手机号已注册
					this.$toast(res.data.msg);
				} else if (res.data.ret === 1 ) { // 改手机号可以注册 发送验证码
					this.count = 60;
					this.PhoneDisabled = true;
					this.interval = setInterval(() => {
						this.count = this.count - 1;
						this.securityCode = this.count + 's再次获取';
						if (this.count <= 0) {
							this.PhoneDisabled = false;
							this.securityCode = '发送验证码';
							clearInterval(this.interval);
						}
					}, 1000)

				}
			})
			
		},
		async submit() {
			console.log(this.verifyCode)
			if (this.phone === '' || !/^1[3|4|5|7|8|9]\d{9}$/.test(this.phone) || this.phone.length <= 10) {
				this.$toast('请输入正确的手机号') 
				return;
			} else if (this.verifyCode === '' || this.verifyCode.length === 0) {
				this.$toast('请输入验证码')
			} else if (this.password === '' || !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/.test(this.password)) {
				this.$toast('请输入正确格式的密码')
			} else {
				let postRegisterData = {
					phone: this.phone,
					password: Md5(this.password),
					veriCode: this.verifyCode
				};
				var httpUrl = await this.$openApi.post('/api/v3/user/register', postRegisterData).then((res) => {
					if (res.data.ret === 3) {
						this.$toast('请输入正确的手机号');
					} else if (res.data.ret === 2) {
						this.$toast('验证码错误');
					} else if (res.data.ret === 1 && res.data.data.custId) {
						this.$opusApi.post("/yyl/v3/vote/insertRegist", {custId: res.data.data.custId});					
						this.$router.push("/vote-baiquan/download")
					}
				});
				
			}
		}
		
	},

}
</script>
<style>

@import "#/css/var.css";
.account{
	& .cover{
		background: #52cfbd url("../../assets/banner_zc.jpg") no-repeat center bottom; 
		background-size: 100% auto;
    	height: 270px;
		margin-bottom: 20px;
	}
	& .item{
		& .item-wrap{
			padding: .1rem 0;
			border-top: none;
			border-bottom: 1px solid #e7e7e7;
			& .y-input-wrap{
				border:none;
			}
		}
		& input{
			font-size: 15px;
			padding: 0.2rem 0.3rem;
		}
		& button{
			min-width: 100px;
			padding: 0;
			font-size: .28rem;
			height:.6rem;
			margin: .1rem .3rem .1rem 0;
		}
		& .button.disabled {
			background: #d7d7d7;
			pointer-events: none;
		}
		& .seePassword{
			width: 60px;
			background: url("../../assets/eye_hide.png") no-repeat center center;
			background-size: 20px;
		}
		& .seePassword.show{
			background: url("../../assets/eye.png") no-repeat center center;
			background-size: 20px;
		}
	}

	& .account-ok-btn{
		margin: 20px auto;
		font-size: .34rem;
	}
	& .account-servies{
		text-align: center;
		& input{
			margin-right: 2px;
		}
		& span{
			color: #00aff7;
		}
	}
	& .old-user-tips{
		text-align: center;
		font-size: 14px;
		color: #999;
	}

	
}

</style>
<style scoped>
html,body{
	min-height: 100vh;

}
</style>


