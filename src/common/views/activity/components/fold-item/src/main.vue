<template>
	<y-item class="fold-item-wrap">
		<div slot="head">
			<span class="iconfont" :class="icon"></span>
			<span v-text="title"></span>
		</div>
		<div slot="foot" @click="showContent">
			<span v-text="showArrowTxt"></span>
			<span class="iconfont" :class="classList"></span>
		</div>
		<div slot="addon" v-show="show" class="content" v-html="content">
		</div>
	</y-item>
</template>

<script>
export default {
	name: 'y-fold-item',
	components: {

	},
	props: {
		title: {
			type: String,
			required: true
		},
		openField: {
			type: String,
			default: ''
		},
		closeField: {
			type: String,
			default: ''
		},
		content: {
			type: [String, Object],
			required: true
		},
		icon: {
			type: String
		}
	},
	data() {
		return {
			show: false,
		}
	},
	computed: {
		classList() {
			return this.show ? 'icon-arrow-up' : 'icon-arrow-down';
		},
		showArrowTxt() {
			return this.show
				? this.openField
				: this.closeField;
		},
	},
	methods: {
		showContent() {
			return this.show = !this.show;
		},
	}
}
</script>

<style>
@import '#/css/var.css';
.fold-item-wrap {
	& .item-wrap {
		& .item-head {
			& .item-titles {
				color: var(--theme-color);
			}
		}
		& .item-foot {
			color: var(--text-assist-color);
		}
	}
	& .item-addon {
		& .content {
			padding-bottom: .2rem;
		}
	}
}
</style>


