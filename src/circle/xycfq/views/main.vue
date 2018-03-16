<template>
	<div class="main">
		<y-nav v-bind="navConfigData"></y-nav>
		<router-view></router-view>
	</div>
</template>
<script>
	import circleResource from '../config/resource_cn'
	let defaultNavConfigData = {
		title: circleResource['xycf'],
		menuData: []
	}
	export default {
		data() {
			return {
				navConfigData: {
					...defaultNavConfigData,
					menuData: [ 'refresh', 'copy-url', 'index' ],
				}				
			}
		},
		watch: {
			'$route': function () {
				this.navConfigData = Object.assign(defaultNavConfigData, { ...this.$route.meta });
			}
		},
		beforeRouteEnter(to, from, next) {
			next((vue) => {
				vue.navConfigData = Object.assign(defaultNavConfigData, { ...to.meta });
			});
		}
	}
</script>
