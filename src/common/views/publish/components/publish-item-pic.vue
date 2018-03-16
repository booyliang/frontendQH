<template>
	<y-flow-item :data="data">
		<div slot='media'>
			<ul class="publish_item-pic" v-if="data.imgUrl">
				<li v-for="(item, index) in imgData" :key="index"><img :src="item | imageResize(filterSize)" alt=""></li>
			</ul>
		</div>
		<p class="publish_item-label" v-if="data.label" slot="left-bottom">{{ data.label }}</p>
	</y-flow-item>
</template>
<script>
	import YFlowItem from '@/components/flow-item'
	import ImageResize from '@/filters/imageResize'
	export default {
		components: {
			YFlowItem
		},
		props: {
			data: Object
		},
		created() {
			this.data.audioUrl = '';
		},
		computed: {
			imgData() {
				return this.data.imgUrl.split(',').slice(0, 9) || null;
			},
			filterSize() {
				let size = null;
				if (this.imgData.length === 2 || this.imgData.length === 5 || this.imgData.length === 8) {
					size = 10; // 339x339
				} else if (this.imgData.length === 3 || this.imgData.length === 6 || this.imgData.length === 9) {
					size = 2; // 222x222
				} else {
					size = 3; // 690x388
				}
				return size;
			}
		}
	}
</script>
<style>
@import '#/css/var.css';
	.publish_item-pic {
		margin-top: .12rem;
		&:before, &:after{
			content: '';
			display: table;
		}
		&:after{
			clear: both;
		}
		& > li{
			position: relative;
			float: left;
			padding-bottom: 33.33%;
			outline: .12rem solid white;
			& > img{
				position: absolute;
			    left: 0;
			    top: 0;
			    width: 100%;
			    height: 100%;
			}
			&:only-child {
				width: 100%;
				padding-bottom: 56.23%;
				margin-bottom: 0;
			}
			&:nth-last-child(2),
			&:nth-last-child(2) + li,
			&:nth-last-child(4),
			&:nth-last-child(4) + li {
				width: 50%;
				padding-bottom: 50%;
			}
			&:nth-last-child(3),
			&:nth-last-child(3) ~ li {
				width: 33.33%;
				padding-bottom: 33.33%;
			}
			&:nth-last-child(4){
				width: 100%;
				padding-bottom: 56.23%;
			}
			&:nth-last-child(4) ~ li {
				width: 33.33%;
				padding-bottom: 33.33%;
			}
			&:nth-last-child(5),
			&:nth-last-child(5) + li {
				width: 50%;
				padding-bottom: 50%;
			}
			&:nth-last-child(5) ~ li:nth-child(n+3) {
				width: 33.33%;
				padding-bottom: 33.33%;
			}
			&:nth-last-child(6),
			&:nth-last-child(6) ~ li {
				width: 33.33%;
				padding-bottom: 33.33%;
			}
			&:nth-last-child(7) {
				width: 100%;
				padding-bottom: 56.23%;
			}
			&:nth-last-child(7) ~ li,
			&:nth-last-child(7) ~ li:nth-child(n+2) {
				width: 33.33%;
				padding-bottom: 33.33%;
			}
			&:nth-last-child(8),
			&:nth-last-child(8) + li {
				width: 50%;
				padding-bottom: 50%;
			}
			&:nth-last-child(9),
			&:nth-last-child(9) ~ li {
				width: 33.33%;
				padding-bottom: 33.33%;
			}
		}
	}
</style>

