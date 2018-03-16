<template>
	<div class="not-found">
		<y-nav v-if="showNav"></y-nav>
		<div class="not-found-wrap">
			<div class="not-img removed-img"></div>
			<p>你访问的私圈已被下架</p>
		</div>
	</div>
</template>

<script>
export default {
	name: 'y-removed-coterie',
	computed: {
		showNav() {
			return this.$route.query.type !== "forward";
		}
	},
	mounted() {
		var appDom = document.getElementById('app')
		if (appDom) appDom.className = '';
		if (this.$route.query.type === "forward") {
			this.$yryz.infoRemove();
		}
	}
}
</script>