<!-- Author: Boring -->

<template>
	<a href="javascript:;" @click="handleClick">
		<slot></slot>
	</a>
</template>

<script type="text/javascript">
import 'core-js/fn/string/starts-with';
import 'core-js/fn/string/ends-with';

export default {
	name: 'y-link',

	props: {
		url: {
			type: String,
			required: true
		}
	},

	data() {
		return {

		};
	},

	methods: {
		handleClick() {
			this.$emit('click')
			if (this.url.startsWith('http')) {
				if (this.isVideo()) {
					this.$yryz.playVideo({
						videoUrl: this.url
					});
				} else {
					this.$yryz.openUrl({
						url: this.url
					});
				}
			} else {
				let jumpUrl = `${window.location.protocol}//${window.location.host}/xycfq${this.url}`;
				if (this.$yryz.isNative()) {
					this.$yryz.jumpUrl({
						url: jumpUrl
					})
				} else {
					this.$router.push(this.url);
				}
			}

		},

		isVideo() {
			return this.url.endsWith('.mp4');
		}
	}
};
</script>