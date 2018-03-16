<template>
	<div class="classify-list">
		<ul>
			<li class="item-p first-name" @click="select(null)">{{$R('all')}}</li>
			<li v-for="(item,index) of data" class="item-p" :class="currentIndex==index?'active':''" @click="select(index)">{{item.designation}}</li>
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
				this.$emit('select', this.data[index].designation);
				this.currentIndex = index;
			}
			
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.classify-list {
	display: flex;
	flex-wrap: wrap;
	position: relative;
	width: 100%;

	& ul {
		width: 100%;
		height: 5.7rem;
		overflow-y: auto;
		& .item-p {
			line-height: 0.8rem;
			border-bottom: 0.01rem solid #E7E7E7;
			font-size: 15px;
			padding: 0 0.2rem;
			background: #fff;
		}
		& .first-name {
			/*font-weight: bold;*/
			color: #999;
		}
		& .active {
			background: #F8F8F8;
		}
	}
}
</style>
