<template>
	<!--修改认证信息-->
	<div class="jkys-authentication-info">
		<y-nav title="悠然认证"></y-nav>
		<div class="jkys-authentication-info-img">
			<span>当前的认证信息为</span>
			<p v-text="curStr(information, 10)"></p>
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
			information: '',
			submitDisabled: true
		}
	},
	components: {
		YNav,
		[Button.name]: Button
	},
	// computed: {
	// 	submitDisabled: function () {

	// 		if (!this.$env.userId) {
	// 			return false;
	// 		} else if (this.$env.userId === this.$route.params.id) {
	// 			return true;
	// 		}
	// 	}
	// },
	created() {
		// alert(this.$env.userId + "||" + this.$route.params.id)
		console.log(this.$env.userId === this.$route.params.id)
		// 查询认证信息
		this.$http.get("/services/app/v1/doctorAuthentication/checkStartByUserId/" + this.$route.params.id)
			.then(res => {
				let adData = res.data.data;
				if (res.data.code === '200') {
					this.information = adData.authenticationSpecification;
				}
			});

		if (this.$env.userId === "" || this.$env.userId === this.$route.params.id) {
			this.submitDisabled = false;
		}


	},
	methods: {
		modificationBtn() {
			this.$router.push({ path: '/shoot/basic/' + 1 });
		},
		curStr(str, len) {
			let str_length = 0;
			let str_len = str.length;
			let str_cut = '';
			for (let i = 0; i < str_len; i++) {
				let a = str.charAt(i);
				str_length++;
				if (escape(a).length > 5) {
					// 中文字符的长度经编码之后大于4
					str_length++;
				}
				str_cut = str_cut.concat(a);
				if (str_length >= len) {
					str_cut = str_cut.concat("...");
					return str_cut;
				}
			}
			// 如果给定字符串小于指定长度，则返回源字符串；
			if (str_length < len) {
				return str;
			}
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