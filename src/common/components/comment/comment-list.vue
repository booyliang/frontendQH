<template>
	<y-list class="comment-list">
		<y-item v-for="(item, index) of data" :key="item.id">
			<y-comment-item :data="item" @delete="handleDelete" :useOpusApi="useOpusApi"></y-comment-item>
		</y-item>
	</y-list>
</template>

<script type="text/javascript">
import List from '@/components/list';
import Item from '@/components/item';
import CommentItem from './comment-item';

export default {
	name: 'y-comment-list',
	components: {
		[List.name]: List,
		[Item.name]: Item,
		[CommentItem.name]: CommentItem
	},
	props: {
		data: Array,
		useOpusApi: Boolean,
	},
	methods: {
		handleDelete(comment) {
			this.$emit('delete', comment);
		},
	},
};
</script>

<style type="text/css">
@import '#/css/var.css';
.comment-list {
	color: var(--text-secondary-color);

	@nest .panel-body & {
		margin-top: -0.4rem;
		margin-bottom: -0.4rem;
	}

	&>.item {
		-webkit-tap-highlight-color: transparent;

		&:not(:first-child) {
			margin-top: -0.3rem;
		}

		& .item-wrap {
			border-top: none;
		}
	}

	& .heat {
		position: absolute;
		right: var(--layout-space);
	}

	&~.empty-tip {
		font-size: .26rem;
		text-align: center;
		color: var(--text-assist-color);
		padding: 0.6rem 0 0.4rem;

		& .icon {
			display: block;
			width: 1.6rem;
			height: 1.26rem;
			background-image: url(../../assets/no-comment@2x.png);
			margin: 0 auto 0.2rem;
		}

		&~.load-more-tip {
			display: none;
		}
	}
}
</style>
