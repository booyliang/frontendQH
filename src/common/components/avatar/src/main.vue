/**
*	Author: yefan
*
*/
<template>
	<component :is="tagName" class="y_avatar" v-bind="routerLinkProps" @click.stop.prevent="onClickAvatar">

		<img class="y_avatar-img" :class="{'y_avatar-default': !src}" :alt="alt" :src="(src || defaultAvatar) | imageResize(imgSize === 'large' ? 2 : 7)">
		<sub v-if="badge" class="y_avatar-badge" :class="badgeClass"></sub>
	</component>
</template>
<script>
import routerLinkMixin from '@/mixins/router-link'
const badgeIcons = ['vip', 'da']
export default {
	name: 'y-avatar',
	props: {
		src: String,
		alt: {
			default: '用户头像'
		},
		defaultAvatar: {
			default: '/assets/static/default-avatar@2x.png'
		},
		badge: Boolean,
		type: {
			type: Number,
			default: 1,
		},
		imgSize: String
	},
	mixins: [routerLinkMixin],
	data() {
		return {
			tagName: this.to ? 'router-link' : 'div',
		};
	},
	computed: {
		badgeClass() {
			let icon = badgeIcons[this.type - 1];
			return {
				[`y_avatar-badge__${icon}`]: this.type
			}
		}
	},
	methods: {
		onClickAvatar() {
			if (!this.to) {
				this.$emit('click-avatar', this.src)
			}
		}
	},
	watch: {
		to(newVal) {
			this.tagName = this.to ? 'router-link' : 'div';
		}
	}
}
</script>
<style>
.y_avatar {
	position: relative;
	width: 100%;
	height: 100%;
	min-width: 0.68rem;
	min-height: 0.68rem;
}

.y_avatar-img {
	width: 100%;
	height: 100%;
	border-radius: 100%;
}

.y_avatar-badge {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 0.4rem;
	height: 0.4rem;
	background-color: #f5cd45;
	background-position: center center;
	background-repeat: no-repeat;
	background-size: 70% 46%;
	border-radius: 100%;
}

.y_avatar-badge__vip {
	background-image: url('./images/v-1@2x.png');
}

.y_avatar-badge__da {
	background-image: url('./images/superStar@2x.png');
}
</style>