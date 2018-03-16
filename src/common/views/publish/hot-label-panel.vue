<template>
	<div class="hot_label-panel">
		<h3 class="hot_label-title" v-text="$R('hot-label-title')"></h3>
		<div class="hot_label-wrap"><p class="hot_label-item" v-for="label in labels"
		:class="{active:labelValue==label.name}"
		 v-text="label.name" @click.stop="handleClick(label)" key="label.id">
		</p></div>
	</div>
</template>
<script type="text/javascript">

	export default {
		props: {
			labels: Array,
			value: String
		},
		data() {
			return {labelValue: this.value}
		},
		watch: {
			value() {
				console.log('label', this.value)
				this.labelValue = this.value;
			}
		},
		methods: {
			handleClick(label) {
				this.$eventBus.$emit('hot-label-click', label.name);				
				this.labelValue = label.name;
				
			}
		}
	}
</script>
<style>
	@import "#/css/var.css";

	.hot_label-panel{
		background-color: #fff;
		padding: 0.3rem 0.1rem 0.3rem 0.14rem;
	}

	.hot_label-title {
		font-size: .28rem;
		color: var(--text-assist-color);
		margin-bottom: 0.3rem;
		text-align: left;
	}

	.hot_label-wrap {
		height: 2rem;
		overflow-y: auto;

		&::-webkit-scrollbar {
			width: 0.06rem;	
			border-radius: 0.1rem;
		}

		&::-webkit-scrollbar-thumb {
			background: #ddd;
			border-radius: 0.1rem;
		}

		&::-webkit-scrollbar-thumb:window-inactive{
			background: #f61;
		}
	}

	.hot_label-item {
		display: inline-block;
		line-height: 0.56rem;
		font-size: .28rem;
		color: var(--text-assist-color);
		padding: 0 0.3rem;
		border-radius: 0.1rem;
		@apply --border;
		margin: 0 0.3rem 0.3rem 0 ;
	}
	.hot_label-item.active {
		color: #fff;
		background: var(--theme-color);
		border: 0;
	}
</style>
