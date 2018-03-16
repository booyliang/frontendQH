<template>
	<div class="turnplate-box">
		<y-nav :show-background="false"></y-nav>
		<div class="turnplate-pan">
			<div class="base">
				<y-luck-draw></y-luck-draw>
				<div class="btns">
					<router-link to="/qql/rule" class="check-btn check-rule"></router-link>
					<!-- <router-link to="/qql/record" class="check-btn check-record"></router-link> -->
					<a @click="goToReward" class="check-btn check-record"></a>
				</div>
			</div>
			
		</div>
		<div class="statement">
			<span v-show="isApple">本抽奖活动与苹果公司无关</span>
		</div>
	</div>
</template>
<script>
import YLuckDraw from './luckdraw'
export default {
	components: { YLuckDraw },
	data() {
		return {
		}
	},
	computed: {
		isApple() {
			var ua = window.navigator.userAgent.toLowerCase();
			var env = this.$env;
			return (ua.indexOf('chrome') < 0) || env.devType === '1';
		},
	},
	methods: {
		async goToReward() {
			await this.$user.login();
			this.$router.push({ path: `/qql/record` });
		}
	}
}
</script>
<style>
@import "#/css/var.css";
.turnplate-box {
	width: 100%;
	min-height: 100vh;
	background: #ffdabd url(../../assets/qql-09award-bg@2x.png) no-repeat;
	background-size: cover;
	position: relative;
	& .nav--background{
		background: none;
		border-bottom: none;
	}
	& .turnplate-pan{
		margin-top: 1.4rem;
	}
	
	& .dialog-title {
		color: #ff9801 !important;
	}
	& .btns{
		position: absolute;
		bottom: .55rem;
		left: .6rem;
		& .check-btn {
			display: inline-block;
			color: #914d0b;
			width: 2.62rem;
			height: 0.86rem;
		}
		& .check-record{
			background: url(../../assets/qql-09award-list@2x.png) no-repeat;
			background-size: cover;
		}
		& .check-rule{
			background: url(../../assets/qql-09award-rule@2x.png) no-repeat;
			background-size: cover;
			margin-right: .5rem;
		}
	}
	
	& .turnplate-pan {
		position: relative;
	}
	& .turnplate-pan img {
		background-color: transparent;
		/*width: 100%;*/
	}
	& .base {
		position: relative;
		width: 7rem;
		height: 9.64rem;
		margin: 0 auto;
		background: url(../../assets/qql-09award-center@2x.png) no-repeat;
		background-size: cover;
		& button{
			color: #fef8e2;
			font-weight: 600;
			font-size: .52rem;
			width: 3rem;
			height: 2.7rem;
			background: url(../../assets/qql-09award-begin@2x.png) no-repeat;
			background-size: cover;
			& p {
				/*-webkit-text-stroke: 1px #f37704;*/
				text-shadow:1px 1px 1px #ff9117;
				margin-bottom: .1rem;
				font-weight: bold;
			}
			
		}
		& .lot-notice{
			color: #fff2ce;
			font-size: .28rem;
			display: block;
		}
		& .lottery{
			position: absolute;
			top: 0.35rem;
			left: 0.35rem;
		}
	}
	& .statement {
		margin-top: 0.15rem;
		text-align: center;
		line-height: 0.7rem;
		height: 0.7rem;
		color: #da4e19;
	}
}
.turnplate-box:after {
	content: "";
	display: table;
}

@media only screen and (min-device-pixel-ratio: 2) {
	
}

@media only screen and (min-device-pixel-ratio: 3) {
	
}
</style>
