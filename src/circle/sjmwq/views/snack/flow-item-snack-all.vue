<template>
	<div class="flow-item-snack-all">
		<router-link :to="`detail/${data.id}`">
			<div class="snack-all-item-wrap">
				<img :src="data.imgUrl" :alt="data.refName">
				<div class="snack-item-intro-wrap">
					<div class="snack-item-name">{{data.refName}}</div>
					<div class="snack-item-intro">
						{{data.breif}}
					</div>
				</div>
			</div>
		</router-link>
	</div>
</template>
<script>
	export default {
		props: {
			data: {
				type: Object,
				required: true,
			},
		},
		created() {
			let itemImg = JSON.parse(this.data.contentSource).find((cItem) => cItem.image).image;
			this.$set(this.data, 'imgUrl', itemImg);
		}
	}
</script>
<style>
@import '../../css/var.css';
.flow-item-snack-all{
	padding: 0.1rem 0.3rem;
	background: #fff;
	@apply --border-bottom;
	& .snack-all-item-wrap{
		display: flex;
		padding: 0.4rem 0;
		& img{
			width: 2rem;
			height: 1.6rem;
		}
		& .snack-item-intro-wrap{
			margin-left: 0.4rem;
		}
		& .snack-item-name{
			font-size: 18px;
		}
		
	}
}
</style>