<!-- Author: Boring -->

<template>
	<a href="javascript:;" @click.stop="handleClick">
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
			// 
			if (this.url.startsWith('http') || this.url.startsWith('quanhu://')) {
				if (this.isVideo()) {
					this.$yryz.playVideo({
						videoUrl: this.url
					});
				} else {
					if (this.url.indexOf('opus.') > -1 || this.url.indexOf('opus-dev.') > -1 || this.url.indexOf('opus-mo.') > -1) {
						this.$yryz.jumpUrl({
							url: this.url
						});
					} else {
						// opus-h 外链
						this.$yryz.openUrl({
							url: this.url
						});
					}
				}
			} else {
				this.$router.push(this.url)
			}

		},

		isVideo() {
			return this.url.endsWith('.mp4');
		}
	}
};
</script>