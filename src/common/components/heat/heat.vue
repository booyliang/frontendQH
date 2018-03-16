/**
*	Author: wangboning
*
*/
<template>
	<div class="heat">
		<span v-if="item" v-for="(item, index) of finalHeat" :key="index" class="heat-item">
			<span v-if="item.text" class="heat-item_key" v-text="item.text"></span>
			<span v-else-if="item.icon" :class="['iconfont', `icon-${item.icon}`]"></span>
			<strong class="heat-item_value" v-text="data[item.field]"></strong>
		</span>
	</div>
</template>

<script type="text/javascript">
	let defaultHeat = {
		comment: {
			icon: 'comment-s-o',
			field: 'commentCount'
		},
		like: {
			icon: 'thumb-o',
			field: 'likeCount'
		},
		view: {
			text: '浏览',
			field: 'viewCount'
		},
		answer: {
			text: '回答',
			field: 'answerCount'
		},
		favorite: {
			text: '收藏',
			field: 'favoriteCount'
		},
		discuss: {
			text: '讨论',
			field: 'replyCount'
		}
	};

	export default {
		name: 'y-heat',

		props: {
			heat: {
				type: Array,
				required: true
			},
			data: {
				type: Object,
				required: true
			},
		},

		computed: {
			finalHeat() {
				return this.heat.map((item) => {
					return defaultHeat[item];
				});
			},
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.heat {
		font-size: .26rem;
		color: var(--text-assist-color);
	}

	.heat-item {
		&:nth-child(n+2) {
			margin-left: 0.3rem;
		}
	}

	.heat-item_value {
		margin-left: 0.2em;
	}
</style>