<template>
	<div>
		<y-nav title="信用借款"></y-nav>
		<div class="xyjd">
			<div class="download_app" @click="openApp">信用借款请下载融众财富APP</div>
		</div>
	</div>
</template>
<script>
	import flowStatusMixin from '../../mixins/flow-status.js'
	import Dialog from '@/components/dialog'
	export default {
		mixins: [
			flowStatusMixin
		],
		data() {
			return {
				statusData: {}
			}
		},
		methods: {
			openApp() {
				if (this.statusData.flowType === 1) {
					this.$toast('您已参加信用助学')
					return;
				}
				if (this.statusData.flowType === 2) {
					this.$toast('您已参加信用赊销')
					return;
				}
				if (!this.$circle.phone) {
					this.$toast('为了账号安全，请在APP个人中心绑定手机号')
					return;
				}
				this.$utils.openAPP('RZ', this);
			}
		}
	}
</script>
<style>
	.xyjd {
		width: 100%;
		height: calc(100vh - 1.28rem);
		background: url(../../assets/xyjk_bg.jpg) no-repeat center;
		background-size: cover;
	}
	.download_app {
		width: 250px;
		text-align: center;
		position: absolute;
		left: 50%;
		bottom: 0.5rem;
		color: #f34d52;
		background-color: #fff;
		font-size: 17px;
		line-height: 37px;
		border: 1px solid #fff;
		border-radius: 37px;
		margin-left: -125px;
	}
</style>