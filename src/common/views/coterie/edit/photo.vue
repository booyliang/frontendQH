<template>
	<div class="edit-photo">
		<!-- 导航 S-->
		<y-nav title="私圈图片" :transparent="true">
		</y-nav>
		<!-- 图片 -->
		<div class="edit-photo-contain">
			<img :src="coterieData.icon" alt="">
		</div>
	</div>
</template>
<script>
import { YNav } from '@/components/nav';
export default {
	components: {
		YNav
	},
	name: 'coterie',
	data() {
		return {
			coterieData: {}
		}
	},
	created() {
		this.$http.get(`/services/app/v1/coterie/info/single/${this.$route.params.coterieId}`).then(res => {
			this.coterieData = res.data.data;
		});
	}
}	
</script>
<style>
@import "#/css/var.css";
.edit-photo {
	color: #fff;
	width: 100vw;
	max-height: 100vh;
	overflow: hidden;
	background: #000;
	& .nav {
		background: #000;
		color: #fff;

		& .iconfont {
			color: #fff;
		}
	}
	& .edit-photo-contain{
		display: flex;
		position: fixed;
		top: 1.28rem;
		right: 0;
		left: 0;
		bottom: 0;
		background: #000;
		justify-content: center;
		align-items: center;
		img {
			width: 100%;
			height: auto;
		}
	}
}
</style>