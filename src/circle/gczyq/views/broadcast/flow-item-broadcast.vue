<template>
	<div class="flow-item-broadcast">
		<router-link :to="`detail/${data.id}`">
			<div class="broadcast-intro" v-text="data.title"></div>
			<p class="broadcast-time">{{data.createDate | recentTime}}</p>
			<img :src="data.coverPlanUrl">			
		</router-link>
	</div>
</template>
<script>
	export default {
		props: {
			data: {
				type: Object,
				required: true
			}
		}
	}
</script>
<style>

@import '#/css/var.css';
.flow-item-broadcast {
	@apply --margin-bottom;
	padding: var(--layout-space);
	background: #fff;
	line-height: 1;

	& img {
		width: 100%;
		height: 3.86rem;
	}
}
.broadcast-intro {
	font-size: 18px;
	color: var(--text-primary-color);
	@apply --text-cut-multi-line;
	-webkit-line-clamp:2;
	line-height: 1.5;
}

.broadcast-time {
	font-size: 12px;
	color: var(--text-assist-color);
	margin: 0.2rem 0;
}
</style>