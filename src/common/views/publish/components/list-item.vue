<template>
	<y-item :class="classList" @click.native.stop="link">
		<div class="list-item">
			<div class="flow_item-head">
				<y-card  :src="data.userImg || data.custImg" @click-img="handleClickImg(data.createUserId)">
					<span name="assist" class="username-color" @click.stop="handleClickImg(data.createUserId)">{{data.nickName || data.custNname}}</span>
				</y-card>
			</div>
			<div class="flow_item-body">
				<div class="flow_item-cover">
					<div v-if="mediaLevel === 'audio'" class="flow_item-audio"></div>
					<img v-else-if="horizontal && data.imgThumbnailUrl" :src="data.imgThumbnailUrl | imageResize(1)" alt="" class="flow_item-thumb">
					<div v-if="hasTitle" class="flow_item-title" v-text="data.title"></div>
					<div class="text-content" v-text="content"></div>
				</div>
				<slot name="media" v-bind="{data}">
					<template v-if="!horizontal">
						<y-flow-item-images v-if="mediaLevel === 'cover'" :data="[data.coverPlanUrl]"></y-flow-item-images>
						<y-video v-else-if="mediaLevel === 'video'" :src="data.videoUrl" :poster="data.videoThumbnailUrl | imageResize(3)" preview class="flow_item-video"></y-video>
						<y-flow-item-images v-else-if="mediaLevel === 'image' && images" :data="images"></y-flow-item-images>
					</template>
				</slot>
			</div>
			<div class="item-foot-count">
				<span>{{data.viewCount || data.readNum || 0}} 阅读</span>
				<span v-if="$route.params.classifyId" @click.stop="toIndex" class="item-foot-child2">{{$circle.circleName}}
					<i class="iconfont icon-arrow-right"></i>
				</span>
			</div>
		</div>
	</y-item>
</template>

<script type="text/javascript">
import Item from '@/components/item';
import Card from '@/components/card';
import Video from '@/components/video';
import Heat from '@/components/heat';
import FlowItemImages from './flow-item-images';
import ImageResize from '@/filters/imageResize'

export default {
	name: 'y-flow-item',

	components: {
		[Item.name]: Item,
		[Card.name]: Card,
		[Video.name]: Video,
		[Heat.name]: Heat,
		[FlowItemImages.name]: FlowItemImages,
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


		images() {
			let urls = this.data.imgUrl.split(',');
			return urls.slice(0, 3);
		},

		classList() {
			return [
				'flow_item',
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
	},
	methods: {
		link() {
			this.$router.push(`/redirect/0091/${this.data.id}`)
		},
		toIndex() {
			this.$router.push('/')
		},
		handleClickImg(userId) {
			this.$yryz.toPersonalInfo({ userId: userId });
		}
	}
};
</script>

<style type="text/css">
@import "#/css/var.css";
.list-item {
	& .username-color{
			color: var(--text-assist-color);
		}
	& .y_card {
		& .y_avatar {
			width: 0.44rem;
			height: 0.44rem;
			min-width: .44rem;
			min-height: .44rem;
			flex: 0 0 .44rem;
		}
		
		& .y_card-title {
			font-size: .3rem;
		}
	}
	& .text-content {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
	}
	& .item-foot-count {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: .26rem;
		color: var(--text-tips-color);
		margin-top: .1rem;

		& .icon-arrow-right:before {
			font-size: .16rem;
		}
	}



	& .flow_item-head,
	.flow_item-foot {
		@apply --display-flex;
		justify-content: space-between;
	}

	& .flow_item-cover {
		@apply --clearfix;
	}

	& .flow_item-audio,
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
			-webkit-line-clamp: 3;
		}
	}

	& .flow_item-audio {
		border: 1px solid #eee;
		/* background: url(../../assets/audio-cover@2x.png) no-repeat; */
		background-size: contain;
	}

	& .flow_item-title,
	.flow_item-content {
		@apply --text-cut-multi-line;
		font-size: 18px;
		line-height: 1.39;
	}

	& .flow_item-title {
		-webkit-line-clamp: 2;
		margin-bottom: 0.1rem;
		font-size: .38rem;
		font-weight: bold;

		&~.flow_item-content {
			font-size: var(--default-font-size);
			line-height: 1.34;
		}
	}

	& .flow_item-content {
		-webkit-line-clamp: 3;
	}

	& .flow_item-video,
	.flow_item-foot {
		margin-top: 0.2rem;
	}

	& .flow_item-video {
		border-radius: 0.12rem;
	}

	& .flow_item-foot {
		/* Temporary hidden. */
		display: none;

		& .heat {
			&:only-child {
				flex: 1;
				text-align: right;
			}
		}
	}

	& .image--responsive>img {
		border-radius: 0.12rem;
	}
}
</style>