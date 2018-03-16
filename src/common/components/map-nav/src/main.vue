/**
*	Author: wangminggui
*
*/
<template>
	<div class="map-wrap" v-if="show">
		<div id="allmap"></div>
		<div class="map-bottom" v-if="navData">
			<div class="map-nav-addr">
				<div v-text="options.address" class="address"></div>
				<div v-text="options.city + options.address" class="city-address"></div>
			</div>
			<span class="iconfont icon-plane-circle" @click="startNav"></span>
		</div>
		<span class="close-map iconfont icon-arrow-left" @click="hideMap"></span>
	</div>
</template>

<script>
import Toast from '@/components/toast'
export default {
	data() {
		return {
			map: null,
			show: false,
			options: {
				province: '',
				city: '',
				address: '',
				lng: '',  // 经度
				lat: '',  // 纬度
			},
			navData: null,
		}
	},
	mounted() {
		// this.init();
	},

	methods: {
		init() {
			window.initMap = this.initMap.bind(this);
			var script = document.createElement("script");
			script.id = 'amap';
			script.type = "text/javascript";
			let protocol = window.location.protocol;
			script.src = `${protocol}//webapi.amap.com/maps?v=1.3&key=0d06a85c9b40b7a03e354af6c8d7fd83&callback=initMap`;
			document.body.appendChild(script);
		},
		initMap() {
			let AMap = window.AMap;
			let param = {
				resizeEnable: true,
				zoom: 12,
			}
			// 经纬度定位
			if (this.options.lat && this.options.lng) {
				let point = [this.options.lng, this.options.lat];
				param = Object.assign({}, param, { center: point });
				this.map = new AMap.Map('allmap', param);
				let name = this.options.province + this.options.city + this.options.address;
				this.map.setZoomAndCenter(16, point);
				this.addMarker(name, point)
				return false;
			}
			// 地点定位
			this.map = new AMap.Map('allmap', param);
			AMap.service('AMap.Geocoder', this.renderMap);
		},
		renderMap() {
			let AMap = window.AMap, _this = this;
			let geocoder = new AMap.Geocoder({ city: `${this.options.city}` });
			geocoder.getLocation(this.options.address, function (status, result) {
				if (status === 'complete' && result.info === 'OK') {
					let name = result.geocodes[0].formattedAddress
					let point = [result.geocodes[0].location.lng, result.geocodes[0].location.lat];
					_this.map.setZoomAndCenter(16, point);
					_this.addMarker(name, point);
				} else {
					// console.log('地址无法解析');
					Toast(_this.$R('no-find-addr'));
					_this.map.setCity(_this.options.city);
				}
			});
		},
		addMarker(name, point) {
			let div = document.createElement('div');
			div.className = 'iconfont icon-addr';
			div.style.fontSize = '28px';
			div.style.color = '#F42B26';
			let AMap = window.AMap;

			let marker = new AMap.Marker({
				map: this.map,
				position: point,
				// clickable: true,
				content: div,
			});
			this.navData = {
				name,
				latitude: point[1],
				longitude: point[0]
			}
		},

		startNav() {
			this.$yryz.mapNavigation(this.navData);
		},

		hideMap() {
			document.body.removeChild(document.getElementById('amap'));
			this.show = false;
		}
	}
}
</script>

<style>
@import "#/css/var.css";
.map-wrap {
	position: fixed;
	z-index: 99;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background: #fff;
	padding-bottom: 1.6rem;
	& #allmap {
		width: 100%;
		height: 100%;
		position: absolute;
		/*bottom: 1.6rem;*/
		margin: auto;
		@apply --border-bottom;
	}
	& .map-bottom {
		width: 100%;
		padding: 0.2rem 0.3rem;
		position: fixed;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;

		z-index: 999;
		background: #fff;

		& .map-nav-addr {
			& .address {
				font-size: .36rem;
			}
			& .city-address {
				font-size: var(--default-font-size);
				color: var(--text-assist-color);
			}
		}
		& .iconfont {
			line-height: 1;
			font-size: .96rem;
			color: var(--theme-color);
		}
	}
	& .close-map {
		position: fixed;
		top: .5rem;
		left: .2rem;
		font-size: .44rem;
		color: #fff;
		padding: .05rem .1rem;
		background: rgba(0, 0, 0, .5);
		border-radius: .1rem;
	}
}
</style>


