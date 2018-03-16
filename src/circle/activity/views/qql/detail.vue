<template>
	<div class="recieve-reward-box">
		<y-nav :show-background="true" title="领取奖品">
		</y-nav>
		<div class="reward-detail">

		</div>
		<y-list class="reciever-info">
			<y-item title="联系人" placeholder="收货人" link="/turnplate/name"></y-item>
			<y-item title="手机号码" placeholder="收货人手机号码" link="/turnplate/setphone"></y-item>
			<y-item title="所在地区" placeholder="湖北 武汉" link="/turnplate/province"></y-item>
			<y-item title="详细地址" placeholder="填写详细地址"></y-item>
		</y-list>
		<y-button block>领取奖品</y-button>
	</div>
</template>
<script>
export default {
	data() {
		return {

		}
	}
}
</script>
<style>
@import "#/css/var.css";
.recieve-reward-box {
	& .reward-detail {
		height: 4rem;
		background: #fff;
	}
	& .reciever-info {
		margin-top: 0.3rem;
	}
	& .button-block {
		margin-top: 0.5rem;
		background: #52cfbf;
	}
}
</style>