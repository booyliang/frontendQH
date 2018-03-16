<template>
	<y-item :class="classList" class="invitation" @click="goDetail">
		<div class="flow_item-head">
			<span class="nickName" v-text="data.nickName" @click.stop="goPersonInfo(data.createUserId)"></span>
			<span class="time">{{ data.createDate | recentTime }}</span>
		</div>
		<div class="flow_item-body">
			<div class="flow_item-cover">
				<div v-if="mediaLevel === 'audio'" class="flow_item-audio"></div>
				<img v-else-if="horizontal && data.imgThumbnailUrl" :src="data.imgThumbnailUrl | imageResize(1)" alt="" class="flow_item-thumb">
				<div v-if="hasTitle" class="flow_item-title" v-text="data.title"></div>
				<div v-if="!remove.includes('content') && content && (!hasTitle || hasTitle && (!mediaLevel || mediaLevel === 'audio'))" class="flow_item-content" v-text="content"></div>
			</div>
			<slot name="media" v-bind="{data}">
				<template v-if="!horizontal">
					<y-flow-item-images v-if="mediaLevel === 'cover'" :data="[data.coverPlanUrl]"></y-flow-item-images>
					<y-video v-else-if="mediaLevel === 'video'" :src="data.videoUrl" :poster="data.videoThumbnailUrl | imageResize(3)" preview class="flow_item-video"></y-video>
					<y-flow-item-images v-else-if="mediaLevel === 'image' && images" :data="images"></y-flow-item-images>
				</template>
			</slot>
		</div>
		<div class="topic_item-footer">
			<div class="topic_item-info">
				<template v-if="showInfo">
					<dl>
						<dt>赞同</dt>
						<dd v-text="data.likeCount"></dd>
					</dl>
					<dl>
						<dt>评论</dt>
						<dd v-text="data.commentCount"></dd>
					</dl>
				</template>
			</div>
		</div>
	</y-item>
</template>

<script type="text/javascript">
	import Item from '@/components/item';
	import CardUser from '@/components/card-user';
	import Video from '@/components/video';
	import Heat from '@/components/heat';
	import FlowItemImages from '@/components/flow-item/flow-item-images';
	import ImageResize from '@/filters/imageResize'

	export default {
		name: 'invitation-item',

		components: {
			[Item.name]: Item,
			[CardUser.name]: CardUser,
			[Video.name]: Video,
			[Heat.name]: Heat,
			[FlowItemImages.name]: FlowItemImages,
		},

		props: {
			data: {
				type: Object,
				required: true
			},
			showInfo: {
				type: Boolean,
				default: true
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
			readNum() {
				return this.data.readNum >= 100000 ? "10万+" : this.data.readNum;
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
		},
		methods: {
			goPersonInfo(userId) {
				this.$yryz.toPersonalInfo({ userId: userId });
			},
			goDetail() {
				this.$router.push({
					path: '/coterie/' + this.$route.params.coterieId + '/topic/detail/' + this.data.id
				})
			}
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";
		
	.invitation {
		
		& .flow_item-head {
			justify-content: flex-start;
		}
		& .nickName { 
			font-size: .28rem; 
			color: var(--active-color); 
			margin-right: .15rem;
		}
		& .time { 
			font-size: .24rem; 
			color: var(--text-tips-color); 
		}	
		
		& .flow_item-content {
			font-size: var(--default-font-size);
			color: var(--text-secondary-color);
			@apply --text-cut-multi-line;
			-webkit-line-clamp: 4;
			line-height: 1.39;
		}
		& .topic_item-footer {
			display: flex;
			justify-content: space-between;
			margin-top: .25rem;
		}
		& .topic_item-info {
			display: flex;
			font-size: .26rem;
			color: var(--text-tips-color);
			& dl {
				display: flex;
				flex-direction: row-reverse;
				& ~ dl {
					position: relative;
					margin-left: .27rem;
					&:after {
						content: "";
						position: absolute;
						top: 50%;
						left: -0.13rem;
						width: .04rem;
						height: .04rem;
						background: #999;
						border-radius: 100%;
						transform: translateY(-50%);
					}
				}
				&:last-of-type {
					margin-right: .2rem;
				}
			}
			& dt {
				padding-left: .1rem;
			}
		}
	}
	
</style>
