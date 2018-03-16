<template>
	<div class="platform_signup-success">
		<div class="signup-container">
			<img src="../../assets/gift.png" alt="">
			<div class="btn-container">
				<h1 class="success-title">积分领取成功</h1>
				<p class="success-info">积分已成功发放到<span class="success-phone">{{phone}}</span>账户，<br />请立即下载圈乎APP去使用积分！<br />更有惊喜大奖等您拿！</p>
				<a class="btn" href="https://static.yryz.com/quanhu/download/index.html">下载圈乎APP</a>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			phone: '您的圈乎'
		}
	},
	mounted() {
		this.phone = this.$route.query.phone;
	}
}
</script>
<style>
@import "#/css/var.css";
.platform_signup-success {
	height: 100vh;
	background: #232779 url('../../assets/bg.png') center bottom no-repeat;
	background-size: 100% auto;
	min-height: 11rem;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	& .signup-container {
		position: relative;
		padding-bottom: .3rem;
		margin-left: 0.9rem;
		width: 5.76rem;
		height: 6.45rem;
		text-align: center;
		& > img {
			width: 2.36rem;
		}
	}
	& .success-title {
		margin-top: 0;
		font-weight: 700;
		font-size: .36rem;
		color: #fff158;
	}
	& .success-info {
		margin: .2rem 0 0;
		font-size: .28rem;
		color: #fff;
		line-height: 1.7;
	}
	& .success-phone {
		padding: 0 .05rem;
		color: #fff158;
	}
	& .btn {
		width: 3.96rem;
		display: inline-block;
		padding: 0.2rem;
		margin-top: 0.7rem;
		border-radius: 0.8rem;
		background-color: #f8654f;
		color: #fff;
		font-size: .36rem;
		line-height: 1;
		text-align: center;
	}
}
</style>


