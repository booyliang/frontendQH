<template>
	<div class="no-data not-found flow_detail">
		<!--<y-nav title="支付成功"></y-nav>-->
		<div class="not-found-wrap">
			<div class="not-img trade-success-img"></div>
			<p>支付成功!</p>
		</div>
	</div>
</template>

<script>
	export default{

	}
</script>

<style>
.not-found.no-data .not-found-wrap .trade-success-img {
	width: 2.4rem;
	height: 2.42rem;
}
/*no data page*/
.trade-success-img{
	background-image: url(../assets/succeed@2x.png); 
}

.not-found .not-img.trade-success-img + p {
	font-size: 22px;
	color: #ffb446;
}
</style>
