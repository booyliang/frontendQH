<template>
	<div class="flow_detail topic-flow invitation">
		<!--<y-card-user :data="data"></y-card-user>-->
		<div class="flow_item-head">
			<span class="nickName" v-text="data.nickName" @click="goPersonInfo(data.createUserId)"></span>
			<span class="time">{{data.createDate | recentTime}}</span>
		</div>
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
		},
		methods: {
			goPersonInfo(userId) {
				this.$yryz.toPersonalInfo({ userId: userId });
			}
		}
	}
</script>
<style>
	@import '#/css/var.css';
</style>
