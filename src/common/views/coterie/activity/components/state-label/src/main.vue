<template>
	<div class="label-wrap">
		<span class="triangle triangle_up" :style="{'border-bottom': borderStyle}"></span>
		<span class="label-status" v-text="label" :style="bgStyle"></span>
		<span class="triangle triangle_down" :style="{'border-top': borderStyle}"></span>
	</div>
</template>

<script>
export default {
	name: 'state-label',
	components: {

	},
	props: {
		status: {
			type: Number,
			required: true,
			default: 1,
		}
	},
	data() {
		return {
			label: '',
			bgColor: '',
			borderColor: '',
		}
	},

	computed: {
		borderStyle() {
			return `.1rem solid ${this.borderColor}`;
		},
		bgStyle() {
			return { 'background-color': this.bgColor };
		}
	},
	mounted() {
		switch (this.status) {
			case 1:
				this.label = '报名中';
				this.bgColor = '#FF6379';
				this.borderColor = '#C61E36'
				break;
			case 2:
				this.label = '正在进行中';
				this.bgColor = '#FEAC33';
				this.borderColor = '#C37A0E'
				break;
			case 3:
				this.label = '已结束';
				this.bgColor = '#A7A7A7';
				this.borderColor = '#848484'
				break;
		}
	}
}
</script>

<style>
.label-wrap {
	position: absolute;
	top: .1rem;
	right: -.1rem;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	& .label-status {
		padding: .1rem .2rem;
		border-top-left-radius: .1rem;
		border-bottom-left-radius: .1rem;
		color: #fff;
	}
	& .triangle {
		width: .1rem;
		border-right: .1rem solid transparent;
	}
}
</style>

