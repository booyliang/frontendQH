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
	height: 10.79rem;
	width: 100%;
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;
}

.one {
	background-image: url(../../static/img01.png);
}

.two {
	background-image: url(../../static/img02.png);
}

.three {
	background-image: url(../../static/img03.png);
}

.four {
	background-image: url(../../static/img04.png);
}

.five {
	background-image: url(../../static/img05.png);
	position: relative;
	& .help-to86 {
		display: block;
		width: 4rem;
		height: 0.7rem;
		background: rgba(0, 0, 0, 0);
		position: absolute;
		bottom: .66rem;
		left: 1.75rem;
		border-radius: 0.3rem;
		overflow: hidden;
		appearance: none;
	}
}
</style>


