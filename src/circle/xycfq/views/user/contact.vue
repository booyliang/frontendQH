<template>
	<div class="contact">
		<y-nav title="联系我们"></y-nav>
		<y-list>
			<y-item value="1161961919" >
				<span slot="head" class="icon-img icon-phone-img">QQ</span>
			</y-item>
			<y-item value="xycf1919" >
				<span slot="head" class="icon-img icon-wechat">微信</span>
			</y-item>
			<y-item value="1161961919@qq.com" >
				<span slot="head" class="icon-img icon-email">邮箱</span>
			</y-item>
		</y-list>
	</div>
</template>
<script>
import YList from '@/components/list'
import YItem from '@/components/item'
export default{
	components: {
		YItem,
		YList
	}
}
</script>
<style>
	.contact{
		& .icon-img {
			display: inline-block;
			padding-left: 0.64rem;
			background-repeat: no-repeat;
			background-position: left center;
			background-size: 0.5rem auto;
		}
		& .icon-phone-img {
			background-image: url(../../assets/icon-phone@2x.png);
		}
		& .icon-wechat {
			background-image: url(../../assets/icon-wechat@2x.png);			
		}
		& .icon-email {
			background-image: url(../../assets/icon-email@2x.png);
		}
	}
</style>