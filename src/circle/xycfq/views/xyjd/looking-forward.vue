<template>
	<div>
		<y-nav title="信用借款"></y-nav>
		<div class="xyjd_lookforward">
		</div>
	</div>
</template>
<script>
	import mobileBindingMixin from '../../mixins/mobile-binding';

	export default {
		mixins: [
			mobileBindingMixin
		],

		data() {
			return {

			}
		}
	}
</script>
<style>
	.xyjd_lookforward {
		width: 100vw;
		height: calc(100vh - 1.28rem);
		background: url(../../assets/xyjd_lookingforward.jpg) no-repeat center;
		background-size: cover;
	}
</style>