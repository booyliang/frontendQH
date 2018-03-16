<template>
	<div  v-if="$yryz.isNative()"  class="bottombanner" :class="{shut: isClosed}">
		<p @click.stop="goHomepage"><span>加入私圈可以了解更多</span><span class="shutbtn iconfont icon-close-o" @click.stop="isClosed = !isClosed"></span></p>
	</div>
</template>
<script>
	export default {
		name: 'y-bottombanner',
		data() {
			return {
				isClosed: false
			}
		},
		mounted() {
			this.toggleComment();
		},
		watch: {
			isClosed(val) {
				this.toggleComment();
			}
		},
		methods: {
			goHomepage() {
				this.$router.push({
					path: `/coterie/${this.$route.params.coterieId}`
				})
			},
			toggleComment() {
				let commentbox = document.getElementById('comment-tool');
				if (!commentbox) return;
				commentbox.style.bottom = !this.isClosed ? "0.61rem" : "0";
			}
		}
	}
</script>

<style>
	.bottombanner {
		position: fixed;
		z-index: 1000;
		bottom: 0;
		width: 100%;
		padding:0.11rem 0;
		background: #80c2ff;
		text-align: center;
		color: #fff;
		font-size:0.28rem;
		& .shutbtn {
			float: right;
			margin-right: 0.2rem;
			font-size: 0.28rem;
		}
		&.shut {
			display: none;
		}
	}
</style>