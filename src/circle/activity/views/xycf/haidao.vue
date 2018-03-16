<template>
	<div class="haidao">
		<div class="haidao_box">
			<!-- <y-nav :transparent="true"></y-nav> -->
		</div>
		<div><img src="../../static/haidao_02.jpg"></div>
		<div><img src="../../static/haidao_03.jpg"></div>
		<div><img src="../../static/haidao_04.jpg"></div>
		<div><img src="../../static/haidao_05.jpg"></div>
		<div><img src="../../static/haidao_06.jpg"></div>
		<div><img src="../../static/haidao_07.jpg"></div>
		<div><img src="../../static/haidao_08.jpg"></div>
		<div><img src="../../static/haidao_09.jpg"></div>
		<div><img src="../../static/haidao_10.jpg"></div>
		<div><img src="../../static/haidao_11.jpg"></div>
		<div><img src="../../static/haidao_12.jpg"></div>
		<div><img src="../../static/haidao_13.jpg"></div>
		<div><img src="../../static/haidao_14.jpg"></div>
		<div><img src="../../static/haidao_15.jpg"></div>
	</div>
</template>
<script>
	export default {
		mounted() {
			this.$circle.circleName = '信用创富圈'
		}
	}
</script>
<style>
	.haidao_box {
		height: 3.74rem;
		width: 100%;
		background: url(../../assets/haidao_01.jpg) no-repeat center;
		background-size: cover;
	}
	.haidao {
		& .nav-background-fix {
		 background: #315ac1;	
		}
		& img {
			display: block;
		}
	}
</style>