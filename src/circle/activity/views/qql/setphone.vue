<template>
	<div>
		<y-nav title="绑定手机号">
			<span slot="nav-right">
				<y-link-button @click.native="submit">完成</y-link-button>
			</span>
		</y-nav>
		<y-input text="true" placeholder="请输入手机号码">
			<y-link-button slot="right" @click.native="getVerifyCode">fdsgfdghfhfh</y-link-button>
		</y-input>
		<y-input placeholder="请输入验证码" text="true" maxlength="6"></y-input>
	</div>
</template>
<script>
export default {
	data() {
		return {

		}
	},
	methods: {
		submit() {

		},
		getVerifyCode() {

		}
	}
}
</script>
<style>

</style>