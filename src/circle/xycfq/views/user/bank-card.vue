<template>
	<div class="bank_card">
		<y-nav title="银行卡"></y-nav>
		<y-panel title="我的银行卡" colorful >
			<div v-for="card in cardData" :key="card.id" class="bank_card-item" @click="deleteCard(card)">
				<span class="info_left"><img :src="card.img" alt="" ></span>
				<div class="info_right">
					<div class="info_name">{{card.bankName.split('·')[0]}}<span class="info_phone">手机尾号： {{card.phone.substr(-4)}}</span></div>
					<div class="info_cardtype">{{card.bankName.split('·')[1]}}</div>
					<div class="info_bottom">{{card.cardNumber.substr(0, 3)}}<span> **** **** **** </span>{{card.cardNumber.substr(-4)}}</div>
				</div>
			</div>
			<div class="add-card" @click="addCard"><span>+ 添加银行卡</span></div>
		</y-panel>
	</div>
</template>
<script>
import YPanel from '@/components/panel'
import banks from '../../config/bank'
export default {
	components: {
		YPanel
	},
	data() {
		return {
			cardData: [],
			moni: [
				{
					bankName: '招商银行·借记卡',
					phone: '15623062872',
					cardNumber: '62108319910124'
				},
				{
					bankName: '建设银行·借记卡',
					phone: '15623062872',
					cardNumber: '62108319910124'
				},
				{
					bankName: '交通银行·借记卡',
					phone: '15623062872',
					cardNumber: '62108319910124'
				}
			]
		}
	},
	mounted() {
		this.getCard();
	},
	methods: {
		async addCard() {
			let res = await this.$http.get('/services/app/v1/flowInfo/status');
			if (res.data.code !== '200')
				return;
			if (res.data.data.flowStatus !== 1) {
				this.$router.push('/user/add-bank-card')
			} else {
				this.$toast('请完善基本资料');
				return;
			}
		},
		deleteCard(card) {
			this.$dialog.confirm('确认删除银行卡？').then(() => {
				this.$http.delete('/services/app/v1/bankCard/single/' + card.id).then(response => {
					if (response.data.code === '200') {
						this.$toast('删除成功').then(() => {
							this.getCard();
						})
					}
				})
				.catch(ex => {
					this.$toast('删除失败');
					console.log(ex);
				})
			})
		},
		getCard() {
			this.$http.get('/services/app/v1/bankCard/list/1/100').then(response => {
				if (response.data.code === '200') {
					let cardData = response.data.data.entities;
					// let cardData = this.moni;
					for (let bank of banks) {
						for (let card of cardData) {
							if (bank.name === card.bankName.split('·')[0]) {
								card.img = bank.icon;
							}
						}
					}
					this.cardData = cardData;
				}
			})
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.bank_card{
	& .panel-head {
		margin: 0 0.3rem;
		padding: 0;
	}

	& .list{
		margin: 0;
	}
	& .bank_card-item {
		display: flex;
		margin-bottom: 0.3rem;
		border-top-left-radius: 0.2rem;
		border-top-right-radius: 0.2rem;
		background: #fa4250;
		color: #fff;
		padding: 0.2rem;
		& .info_left {
			display: inline-flex;
			justify-content: center;
			align-items: center;
			width: 0.9rem;
			height: 0.9rem;
			background: #fff;
			@apply --round;
			border: 0.03rem solid #fb6873;
			margin-right: 0.18rem;
			& img {
				width: 0.54rem;
				height: 0.54rem;
			}
		}
		& .info_right{
			flex: 1;
			line-height: 1;
			padding-top: 0.1rem;
			& .info_name {
				display: flex;
				justify-content: space-between;
			}
			& .info_phone, & .info_cardtype{
				font-size: 12px;
			}
			& .info_cardtype {
				margin-top: 10px;
			}

			& .info_bottom {
				margin-top: 14px;
				font-size: 21px;
			}
		}
	}
	& .add-card {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 1.92rem;
		border: 1px dashed #999;
		border-top-left-radius: 0.2rem;
		border-top-right-radius: 0.2rem;
		color: #666;
		background-color: #f8f8f8;
		& span{
			font-size: 17px;
		}
	}
}
</style>