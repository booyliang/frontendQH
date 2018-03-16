<template>
	<y-item :class="classList" :to="link" tag="div">
		<!-- <div class="flow_item-head">
			<y-card-user v-bind="{data}"></y-card-user>
			<slot name="right-top" v-bind="{data}"></slot>
		</div> -->
		<div class="flow_item-body">
			<div class="flow_item-cover">
				<img :src="data.imgThumbnailUrl | imageResize(1)" alt="" class="flow_item-thumb">
				<div v-if="hasTitle" class="flow_item-title" v-text="data.title"></div>
				<div class="flow_item-content" v-text="content"></div>
			</div>
		</div>
		<div class="flow_item-foot">
			<slot name="left-bottom" v-bind="{data}"></slot>
			<y-heat v-bind="{heat, data}"></y-heat>
		</div>
	</y-item>
</template>

<script type="text/javascript">
	import Item from '@/components/item';
	import CardUser from '@/components/card-user';
	import Heat from '@/components/heat';

	export default {
		name: 'y-flow-item',

		components: {
			[Item.name]: Item,
			[CardUser.name]: CardUser,
			[Heat.name]: Heat
		},

		props: {
			data: {
				type: Object,
				required: true
			},
			horizontal: Boolean,
			heat: {
				type: Array,
				default() {
					return [
						'comment',
						'like',
					];
				}
			},
			remove: {
				type: Array,
				default() {
					return [];
				}
			}
		},

		computed: {
			link() {
				let {
						moduleEnum,
					id
					} = this.data;
				return `/redirect/${moduleEnum}/${id}`;
			},

			images() {
				let urls = this.data.imgUrl;
				return urls ? urls.split(',').slice(0, 3) : null;
			},

			classList() {
				return [
					'flow_item',
					{
						'unshelved': this.data.shelveFlag === 1
					}
				];
			},

			content() {
				return this.data.description || this.data.content;
			},

			mediaLevel() {
				if (this.data.coverPlanUrl) {
					return 'cover';
				}

				if (this.data.videoUrl) {
					return 'video';
				}

				if (this.data.audioUrl) {
					return 'audio';
				}

				if (this.data.imgUrl) {
					return 'image';
				}
			},

			hasTitle() {
				return !!this.data.title;
			}
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.flow_item {
		& .item-wrap {
			display: block;
			padding-top: 0.4rem;
			padding-bottom: 0.2rem;
		}
	}

	.flow_item-head,
	.flow_item-foot {
		@apply --display-flex;
		justify-content: space-between;
	}

	.flow_item-head {
		margin-bottom: 0.2rem;
	}

	.flow_item-cover {
		@apply --clearfix;
	}

	.flow_item-audio,
	.flow_item-thumb {
		float: left;
		width: 2rem;
		height: 1.8rem;
		margin-right: 0.4rem;

		&~.flow_item-title {
			line-height: 1.2;
			margin-bottom: 0.1rem;
		}
		&~.flow_item-content {
			-webkit-line-clamp: 2;
		}
	}
	
	.flow_item-title,
	.flow_item-content {
		@apply --text-cut-multi-line;
		font-size: .36rem;
		line-height: 1.39;
	}

	.flow_item-title {
		-webkit-line-clamp: 2;
		margin-bottom: 0.1rem;

		&~.flow_item-content {
			font-size: var(--default-font-size);
			line-height: 1.34;
		}
	}

	.flow_item-content {
		-webkit-line-clamp: 4;
	}

	.flow_item-video,
	.flow_item-foot {
		margin-top: 0.2rem;
	}

	.flow_item-foot {
		/* Temporary hidden. */
		display: none;

		& .heat {
			&:only-child {
				flex: 1;
				text-align: right;
			}
		}
	}
</style>