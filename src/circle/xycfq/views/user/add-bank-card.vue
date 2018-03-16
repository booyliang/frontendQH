<template>
	<div class="add_card">
		<y-nav title="添加银行卡"></y-nav>
		<y-list>
			<y-item :title="name" :value="idCardNo"></y-item>
			<y-input :placeholder="$R('cardPlaceHolder')" v-model="card"></y-input>
			<y-input :placeholder="$R('phonePlaceHolder')" v-model="phone"></y-input>
		</y-list>
		<div class="layout">
			<label><span class="iconfont icon-tips"></span>专项用于可能发生的退货款使用</label>
			<y-button block @click.native="handleAddCard">同意</y-button>
		</div>
	</div>
</template>
<script>
import YList from '@/components/list'
import Toast from '@/components/toast'
import CardNoTest from '../../config/cardnoTest'
export default {
	components: {
		YList
	},
	data() {
		return {
			name: '',
			idCardNo: '',
			card: '',
			phone: ''
		}
	},
	created() {
		this.$http.get('/services/app/v1/flowInfo/credit/info').then(response => {
			if (response.data.code === '200') {
				let data = response.data.data;
				this.name = data.name;
				this.idCardNo = this.starNum(data.idCardNo);
			}
		})
	},
	methods: {
		handleAddCard() {
			if (!this.card) {
				Toast('请输入银行卡号');
				return;
			}
			if (!/^\d*$/.exec(this.card)) {
				Toast('银行卡号必须全为数字');
				return;
			}
			if (this.card.length < 15 || this.card.length > 19) {
				Toast('银行卡为15-19位数字');
				return;
			}  
			if (CardNoTest.indexOf(this.card.substr(0, 6)) < 0 && CardNoTest.indexOf(this.card.substr(0, 6)) < 0) {
				Toast('系统未监测到卡号所属银行，推荐使用可提现银行的银行卡');
				return;
			}
			if (!this.phone) {
				Toast('请输入手机号');
				return;
			}
			if (!/^1[0-9]{10}$/.test(this.phone)) {
				Toast('手机号有误');
				return;
			}
			let postData = {
				cardNumber: this.card,
				phone: this.phone,
				username: this.name
			};
			this.$http.post('/services/app/v1/bankCard/single', postData).then(response => {
				if (response.data.code === '200') {
					Toast('添加成功').then(() => {
						this.$router.back();
					})
				} else {
					Toast(response.data.msg);
				}
			})
			.catch(error => {
				Toast('可能出了一点小问题');
				console.log(error);
			});
		},
		starNum(num) {
			num = num.toString();
			let str = num.substr(0, 3);
			for (var i = 0; i < num.length - 7; i++) {
				str += '*';
			}
			str += num.substr(-4);
			return str;
		}
	}
}
</script>
<style>
@import '#/css/var.css';

	.add_card{
		& .list {
			background: #fff;
			margin-bottom: 0.2rem
		}
		& .item-wrap {
			padding: 0.4rem 0.16rem;
		}

		& .y-input-wrap{
			& input{
				font-size: 17px;
				padding: 0.4rem 0;
				margin: 0 0.3rem;
				@apply --border-top;
			}
		}
		& .layout{
			padding: 0 0.3rem;
			& label{
				color: #ff2a20;
				visibility: hidden;
				& .icon-tips{
					margin-right: 0.15rem;
				}
			}
			& .button{
				margin-top: 1.5rem;
			}
		}
	}
</style>