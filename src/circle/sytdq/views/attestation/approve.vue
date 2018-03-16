<template>
	<!--修改认证信息-->
	<div class="jkys-authentication-info">
		<y-nav title="悠然认证"></y-nav>
		<div class="jkys-authentication-info-img">
			<span>当前的认证信息为</span>
			<p v-text="information"></p>
		</div>
		<y-button block @click.native='modificationBtn' :disabled="submitDisabled">修改认证信息</y-button>
	</div>
</template>

<script>
import { YNav } from '@/components/nav';
import Button from '@/components/button';
export default {
	data() {
		return {
			information: ''
		}
	},
	components: {
		YNav,
		[Button.name]: Button
	},
	computed: {
		submitDisabled: function () {
			if (this.$env.userId === parseInt(this.$route.params.id)) {
				return true;
			}
		}
	},
	created() {
		console.log(this.$env.userId)
		// 查询认证信息
		this.$http.get("/services/app/v1/photographer/checkStartByUserId/" + this.$route.params.id)
			.then(res => {
				let adData = res.data.data;
				if (res.data.code === '200') {
					this.information = adData.authenticationSpecification;
				}
			})
	},
	methods: {
		modificationBtn() {
			this.$router.replace({ path: '/shoot/basic/' + 1 });
		}
	}
}
</script>

<style>
@import "#/css/var.css";

.jkys-authentication-info {
	& .jkys-authentication-info-img {
		width: 6.18rem;
		height: 6.38rem;
		background: url(../../assets/identity-card@2x.png) no-repeat center;
		background-size: contain;
		margin: 0.6rem auto 0;
		text-align: center;

		& span {
			padding-top: 2.96rem;
			display: block;
			font-size: 16px;
			color: var(--text-assist-color);
		}

		& p {
			font-size: 18px;
			color: var(--text-primary-color);
			padding-top: 0.78rem;
		}
	}

	& .button {
		font-size: 17px;
		margin-top: 0.9rem;
		border-radius: 0.1rem;
	}
}
</style>