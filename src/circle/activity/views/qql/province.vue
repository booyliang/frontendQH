<template>
	<div>
		<y-nav title="常驻城市">
		</y-nav>
		<div>
			<y-list>
				<y-item @click.native="clickCity(item)" clickable v-for="item of YCityData" :title="item.text" :key="item.id"></y-item>
			</y-list>
		</div>
	</div>
</template>

<script>
import YCityData from '@/js/citydata';
export default {
	data() {
		return {
			YCityData
		}
	},
	methods: {
		clickCity: function (item) {
			this.$router.push('/invest/city/' + item.text)
		}
	}
}
</script>