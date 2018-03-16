<template>
	<y-hot :hots="['like', 'forward']" :data="data">
	</y-hot>
</template>
<script>
import YHot from './'
export default {
	components: {
		YHot
	},
	data() {
		return {
			data: {}
		}
	},
	created() {
		this.$http.get('/services/app/v1/post/single/138').then(response => {
			this.data = response.data.data;
		})
	}
}
</script>