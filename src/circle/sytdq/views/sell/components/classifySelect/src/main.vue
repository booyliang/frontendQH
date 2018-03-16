<template>
	<div class="classify-list">
		<ul>
			<li class="item-p first-name" @click="select(null)">{{$R('all')}}</li>
			<li v-for="(item,index) of data" class="item-p" :class="currentIndex==index?'active':''" @click="select(index)" :key="index">{{item.name}}</li>
		</ul>
	</div>
</template>
<script>
export default {
	name: 'y-classify-select',
	components: {},
	props: {
		data: {
			type: Array,
			require: true
		}
	},
	data() {
		return {
			currentIndex: null,
		}
	},
	methods: {
		select(index) {
			if (index === null) {
				this.currentIndex = null;
				this.$emit('select', null);
			} else {
				this.currentIndex = index;
				this.$emit('select', this.data[index].name, this.data[index].id);
			}
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.classify-list {
	position: relative;
	width: 100%;

	& ul {
		width: 100%;
		overflow-y: auto;
		& .item-p {
			line-height: 44px;
			@apply --border-bottom;
			font-size: 16px;
			background: #fff;
			padding: 0 0.3rem;
		}
		& .active {
			background: var(--bg-color);
		}
	}
}
</style>
