<template>
	<div class="jkys-defeated">
		<y-nav title="悠然认证"></y-nav>
		<div class="jkys-defeated-img"></div>
		<p>审核失败</p>
		<!--<p>失败原因：{{message}}</p>-->
		<y-button block @click.native='submit'>重新认证</y-button>
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
			message: '',
		}
	},
	methods: {
		submit() {
			this.$router.replace({ path: '/shoot/basic/' + 2 });
		}
	},
	created() {
		// 查询认证信息
		this.$http.get("/services/app/v1/photographer/checkStartByUserId/" + this.$env.userId)
			.then(res => {
				let adData = res.data.data;
				if (res.data.code === '200') {
					this.message = adData.authenticationSpecification;
				}
			})
	}
}
</script>

<style>
.jkys-defeated {
	text-align: center;
	& .jkys-defeated-img {
		width: 3rem;
		height: 3rem;
		background: url(../../assets/state-failure@2x.png) no-repeat center;
		background-size: contain;
		margin: 2.3rem auto 0;
	}
	& p {
		font-size: 16px;
		color: #b4b4b4;
		&:first-of-type {
			margin-top: 0.5rem;
		}
	}
	& .button {
		margin-top: 0.9rem;
		font-size: 17px;
		border-radius: 0.1rem;
	}
}

& .button {
	margin-top: 0.9rem;
	font-size: 17px;
	border-radius: 0.1rem;
}
</style>