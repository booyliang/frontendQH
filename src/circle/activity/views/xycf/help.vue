<template>
	<div class="haidao">
		<div class="help-box one">
			<!-- <y-nav :transparent="true"></y-nav> -->
		</div>
		<div class="help-box two"></div>
		<div class="help-box three"></div>
		<div class="help-box four"></div>
		<div class="help-box five">
			<span class="help-to86" @click="tohaidao"></span>
	
		</div>
	</div>
</template>
<script>
export default {
	mounted() {
		this.$circle.circleName = '信用创富圈'
	},
	methods: {
		tohaidao() {
			this.$router.push("/xycf/haidao")
		}
	}
}
</script>
<style>
.help-box {
	height: 6.48rem;
	width: 100%;
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;
}

.one {
	background-image: url(../../static/temp_img_01.png);
}

.two {
	background-image: url(../../static/temp_img_02.png);
}

.three {
	background-image: url(../../static/temp_img_03.png);
}

.four {
	background-image: url(../../static/temp_img_04.png);
}

.five {
	background-image: url(../../static/temp_img_05.png);
	position: relative;
	& .help-to86 {
		display: block;
		width: 4rem;
		height: 0.71rem;
		background: rgba(0, 0, 0, 0);
		position: absolute;
		bottom: .7rem;
		left: 1.75rem;
		border-radius: 0.3rem;
		overflow: hidden;
		appearance: none;
	}
}
</style>


