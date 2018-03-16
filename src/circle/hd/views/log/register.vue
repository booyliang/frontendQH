<template>
	<div class="account">
		<y-nav title= "注册"></y-nav>
		<y-item>
			<y-input v-model="phone" :autofocus='true' type='Number' :maxlength='11' :disabled='PhoneDisabled' placeholder="请输入手机号码" :show-text-length-info="false"></y-input>
		</y-item>
		
		<y-item>
			<y-input v-model='verifyCode' :maxlength='6' placeholder="请输入验证码" :show-text-length-info="false">
			<y-button slot='right' type='span'  @click.native='regSendCode'>{{securityCode}}</y-button>
		</y-input>
		</y-item>
		<y-item>
			<y-input v-model="password" :autofocus='true' type='text' :maxlength='18'  placeholder="设置登录密码（6~18位数字+字母组合）" :show-text-length-info="false"></y-input>
		</y-item>
		<y-button  block @click.native="submit" class="account-ok-btn">完成</y-button>

		<div class="account-servies">
			<label><input type="checkbox">我已阅读并接受《<router-link tag="span" to="/log/servies">用户服务协议</router-link>》的条款</label>			
		</div>
		<div class="account-download">
			<router-link tag="a" to="/">下载悠然一指</router-link>
		</div>

	</div>
</template>
<script>
import YNav from '@/components/nav/nav';
import Item from '@/components/item';
import YInput from '@/components/input';
export default {
	components: {
		[YNav.name]: YNav,
		[Item.name]: Item,
		[YInput.name]: YInput,
	},
	data() {
		return {
			securityCode: '获取验证码',
			PhoneDisabled: false,
			phone: '',
			verifyCode: '',
			password: '',
			vm: {
				data: {}
			}
		}
	},
	methods: {
		regSendCode() { // 发送验证码
		
			if (this.phone === '' || !/^1[3|4|5|7|8|9]\d{9}$/.test(this.phone)) {
				return this.$toast('手机号输入错误')
			}
			if (this.PhoneDisabled) return;
			
			// 发送验证码接口 待修改  // TODO
			this.$openApi.post('/api/v3/user/sendVerifyCode', {"phone": this.phone, "code": '1', "type": "1"}).then((res) => {
				if (res.data.res === 2) { // 改手机号已注册
					this.$toast(res.data.msg);
				}
			})
			
			this.count = 60;
			this.PhoneDisabled = true;
			this.interval = setInterval(() => {
				this.count = this.count - 1;
				this.securityCode = this.count + 's再次获取验证码';
				if (this.count <= 0) {
					this.PhoneDisabled = false;
					this.securityCode = '获取验证码';
					clearInterval(this.interval);
				}
			}, 1000)
		},
		async submit() {
			console.log(typeof this.phone)
			let length = this.phone.length;
			if (this.phone === '' || !/^1[3|4|5|7|8|9]\d{9}$/.test(this.phone) || length <= 10) {
				this.$toast('请输入手机号') 
				return;
			} else if (this.verifyCode.length === '') {
				this.$toast('请输入验证码')
			} else {
				let postRegisterData = {
					phone: this.phone,
					password: this.password,
					veriCode: this.verifyCode
				};
				var httpUrl = await this.$openApi.post('/api/v3/user/register', postRegisterData).then((res) => {
					if (res.data.ret) {
						this.vm.data.cellPhone = this.phone;
						this.$router.back();
					} else {
						this.$toast('验证码错误');
					}
				});
			}
		}
	}
}
</script>
<style>

@import "#/css/var.css";
.account{
	& .item{
		& .item-wrap{
			padding: .1rem 0;
			& .y-input-wrap{
				border:none;
			}
		}
		& input{
			font-size: 15px;
		}
	}

	& .account-ok-btn{
		margin: 20px auto;
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
	& .account-download{
		text-align: center;
		margin: 20px auto;
		color: #555;
		text-decoration: underline;
		font-size: 12px;
	}	
}
</style>


