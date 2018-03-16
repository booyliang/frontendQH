<template>
	<div class="map-nav-demo-wrap">
		<y-button @click.native="showAlbum">打开地图</y-button>
	</div>
</template>
<script>
import YButton from '@/components/button'
import mapNav from '@/components/map-nav'
export default {
	components: {
		YButton
	},
	methods: {
		showAlbum() {
			mapNav.init({
				province: '湖北省',
				city: '武汉市',
				address: '光谷国际广场',
				lng: '',  // 经度
				lat: '',  // 纬度
			});
		}
	},
	beforeDestroy() {
		console.log('beforeDestroy');
		mapNav.hide();
	}
}
</script>

