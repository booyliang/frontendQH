<template>
	<div>
		<!-- 评论列表 begin-->
		<y-comment :data="data"></y-comment>
		<!-- 评论列表 end-->
	</div>
</template>
<script>
import comment from './comment'
export default {
	components: {
		[comment.name]: comment
	},
	data() {
		return {
			data: {}
		}
	},
	mounted() {
		this.$http.get('/services/app/v1/answer/detail/39').then(response => {
			console.log(response.data.data);
			this.data = response.data.data || {};
		})
	}
}
</script>
