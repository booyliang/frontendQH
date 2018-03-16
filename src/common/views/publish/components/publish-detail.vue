/**
*	Author: yefan
*
*/
<template>
	<div class="publish-detail" :class="{'vertical': data.coverPlanUrl}">
		<div class="cover flow_detail" v-if="data.coverPlanUrl">
			<img :src="data.coverPlanUrl" width="100%">
		</div>
		<div class="flow_detail">
			<y-card-user :position="cardPosition" :data="data"></y-card-user>
			<h2 class="flow_detail-title" v-if="data.title">{{ data.title }}</h2>
			<div class="assist">
				<p v-text="`日期：${data.date}`" v-if="data.date"></p>
				<p v-text="`地点：${data.province} ${data.city}`" v-if="data.province || data.city"></p>
			</div>
			<p class="flow_detail-description" v-if="data.description">{{ data.description }}</p>
			<y-content-source :content-source="data.contentSource"></y-content-source>
			<y-voting :data="data" class="content_source"></y-voting>
			<y-mood :data="data" class="content_source" v-if="data.moodFlag === 1"></y-mood>
		</div>
	</div>
</template>
<script>
	import YCardUser from '@/components/card-user'
	import YContentSource from '@/components/content-source'
	import YVoting from '@/components/voting'
	import YMood from '@/components/mood'
	import YHot from '@/components/hot';
	export default {
		components: {
			YCardUser,
			YContentSource,
			YVoting,
			YMood,
			YHot
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
		},
		computed: {
			cardPosition() {
				return this.data.coverPlanUrl ? 'vertical' : 'horizontal';
			}
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.publish-detail{
		& .assist{
			color: var(--text-assist-color);
			font-size: .34rem;
			& > p:first-child{
				margin-top: .3rem;
			}
		}
	}
	.publish-detail .cover img{
		height: 4.22rem;
	}
	.flow_detail-description {
		margin-top: 0.2rem;
		font-size: .34rem;
		line-height: 28px;
	}
	.publish-detail {
		& .flow_detail-title {
	        margin-top: .4rem;
		}
		& .cover.flow_detail{
			padding: 0 0;
		}
	}
</style>
