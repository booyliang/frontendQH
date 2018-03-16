<template>
	<div class="payment-type">
		<y-panel title="支付方式" :colorful="true">
			<y-check-group @clickItem="handleChangeCheck" :data="options" type="radio"></y-check-group>
		</y-panel>
	</div>
</template>
<script>
	import YPanel from '@/components/panel'
	import YCheckGroup from '@/components/check-group'
	export default {
		components: {
			YPanel,
			YCheckGroup
		},
		props: {
			value: {},
		},
		data() {
			return {
				payType: 3,
				options: [
					{text: '支付宝支付', id: 3, checked: false},
					{text: '银联支付', id: 12, checked: false}
				]
			}
		},
		watch: {
			'value': 'initOptions'
		},
		methods: {
			handleChangeCheck(item) {
				this.$emit('input', item.id);
			},
			initOptions() {
				this.options.forEach(item => {
					item.checked = item.id === this.value
				})
			}
		},
		created() {
			this.initOptions();
		}
	}
</script>
<style>
	.payment-type {
		& .panel-body {
			padding-top: 0;
			padding-bottom: 0;
		}
		& .check_item-content {
			display: flex;
			align-items: center;
			& span {
				margin-left: .2rem;
			}
			&:before {
				content: '';
				display: block;
				width: .6rem;
				height: .6rem;
			}
		}
		& .check_item {
			padding: .2rem 0;
			&:nth-child(1) {
				& .check_item-content:before {
					background-image: url(../assets/alipay@2x.png);
				}
			}
			&:nth-child(2) {
				border-bottom: 0;
				& .check_item-content:before {
					background-image: url(../assets/unionPay@2x.png);
				}
			}
			& .check_item-content:before {
				background-size: cover;
				background-repeat: no-repeat;
				background-position: center center;
			}
		}
	}
</style>
