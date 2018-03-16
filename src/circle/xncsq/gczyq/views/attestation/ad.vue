<template>
	<div class="jkys-applyfor">
		<y-nav :title="$R('attestation')"></y-nav>
		<!--第一次广告-->
		<div class="jkys-applyfor-img"></div>
		<y-button block @click.native="submit" :monitor='monitor' :disabled='disabled'>{{$R('applyfor')}}</y-button>
	</div>
</template>

<script>
import { YNav } from '@/components/nav';
import Button from '@/components/button';
export default {
	components: {
		YNav,
		[Button.name]: Button
	},
	data() {
		return {
			monitor: null,
			disabled: false
		}
	},
	watch: {
		// 这里禁掉按钮防止网速卡顿重复提交
		monitor() {
			if (this.monitor) this.disabled = true;
		}
	},
	methods: {
		submit() {
			this.monitor = 1;
			console.log(this.$env.userId);
			// 查询认证信息 进行业务跳转。。。。
			this.$http.get("/services/app/v1/doctorAuthentication/checkStartByUserId/" + this.$route.params.id)
				.then(res => {
					let adData = res.data.data;
					console.log(adData);
					if (res.data.code === '200') {
						if (res.data.data === null) {
							this.$router.replace({ path: '/shoot/basic/' + 0 });
						} else if (adData.isAuthentication === 0) {	// 审核中
							this.$router.replace({ path: '/shoot/audit' });
						} else if (adData.isAuthentication === 1) {	// 审核通过
							this.$router.replace({ path: '/shoot/approve/' + this.$route.params.id });
						} else if (adData.isAuthentication === 2 || adData.isAuthentication === 3) {
							this.$router.replace({ path: '/shoot/defeated' });
						}
					}
				})
		}
	}
}
</script>

<style>
.jkys-applyfor {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background: #fff;
	align-items: center;

	& .jkys-applyfor-img {
		width: 4.59rem;
		height: 5.69rem;
		background: url(../../assets/identity@2x.png) no-repeat center;
		background-size: contain;
		margin-top: 1.62rem;
	}

	& .button {
		font-size: 17px;
		margin-top: 1.3rem;
		border-radius: 0.1rem;
	}
}
</style>