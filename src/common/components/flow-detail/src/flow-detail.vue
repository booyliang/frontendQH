/**
*	Author: yefan
*
*/
<template>
	<div class="flow_detail">
		<y-card-user :data="data"></y-card-user>
		<h2 class="flow_detail-title" v-if="data.title">{{ data.title }}</h2>
		<slot name="assist"></slot>
		<y-content-source :content-source="data.contentSource"></y-content-source>
		<slot name="foot"></slot>
	</div>
</template>
<script>
	import YCardUser from '@/components/card-user'
	import YContentSource from '@/components/content-source'
	export default {
		name: 'y-flow-detail',
		components: {
			YCardUser,
			YContentSource
		},
		props: {
			data: {
				type: Object,
				default: () => { return {}; }
			},
			heats: {
				type: Array,
				default: () => { return []; }
			}
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.flow_detail {
		padding: 0.4rem 0.3rem;
		background: #fff;
		& .content_source {
			margin-top: 0.2rem;
		}

		& .y_card--vertical {
			align-items: flex-start;
			flex-direction: row;

			& .y_avatar {
				margin:0 0.3rem 0 0;
			}
			& .y_card-text {
				text-align: left;
			}
		}
	}
	.flow_detail-title {
		margin-top: 0.2rem;
		line-height: 28px;
		font-size: .44rem;
		color: #000;
		overflow : hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
</style>
