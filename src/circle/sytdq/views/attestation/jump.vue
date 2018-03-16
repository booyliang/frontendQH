<template>
	<div>
	</div>
</template>

<script>
export default {
	created() {
		// 查询认证信息
		this.$http.get("/services/app/v1/photographer/checkStartByUserId/" + this.$env.userId)
			.then(res => {
				let adData = res.data.data;
				console.log(adData);
				if (res.data.code === '200') {
					if (res.data.data === null) {
						this.$router.replace({
							path: '/shoot/basic/' + 0
						});
					} else if (adData.isAuthentication === 0) { // 审核中
						this.$router.replace({
							path: '/shoot/audit'
						});
					} else if (adData.isAuthentication === 1) { // 审核通过
						this.$router.replace({
							path: '/shoot/approve/' + this.$env.userId
						});
					} else if (adData.isAuthentication === 2 || adData.isAuthentication === 3) {
						this.$router.replace({
							path: '/shoot/defeated'
						});
					}
				}
			})
	}
}
</script>

<style>

</style>