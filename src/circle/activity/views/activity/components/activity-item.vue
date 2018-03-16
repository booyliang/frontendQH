<template>
	<div class="platform-activity-item">
		<router-link :to="link">
			<div class="activity-title" v-text="data.title"></div>
			<div class="activity-img">
				<img :src="data.coverPlan | imageResize(3)" class="activity-fm-img">
			</div>
		</router-link>
	</div>
</template>

<script type="text/javascript">

export default {
	name: 'activity-item',
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	computed: {
		link() {
			return `/platform-activity/${this.data.activityType === 1 ? 'signup/' : 'vote/'}${this.data.id}`;
		}
	}
};
</script>

<style>
@import "#/css/var.css";

.platform-activity-item {
	@apply --border-bottom;
	position: relative;
	padding: .25rem 0 .3rem 0;
	margin: 0 .3rem;
	background: #fff;

	& .activity-title {
		@apply --text-cut-multi-line;
		-webkit-line-clamp: 2;
		color: var(--text-primary-color);
		font-size: .38rem;
		font-weight: 600;
	}
	& .activity-img {
		position: relative;
		margin-top: .25rem;
		border-radius: .12rem;
		overflow: hidden;
		& .activity-fm-img {
			display: block;
			width: 100%;
			height: 3.1rem;
		}
	}
}
</style>