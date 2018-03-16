<!-- Author: Boring -->

<template>
	<y-load-more :state="state" :offset="3000" @can-load="load">
		<y-list class="dynamic_list">
			<y-item v-for="(item, index) of list" :key="index" :to="getLink(item)" class="dynamic_item">
				<div class="dynamic_item-head">
					<y-card :src="item.detail.userImg" :title="item.nickName" :assist="item.detail.pubTime | recentTime" :to="`/user/${item.createUserId}`"></y-card>
					<y-tag v-if="item.tag" class="dynamic_item-label">{{item.tag}}</y-tag>
				</div>
				<div class="dynamic_item-body">
					<div class="dynamic_item-cover">
						<img v-if="item.thumbnail" :src="item.thumbnail | imageResize(1)" :alt="item.title" class="dynamic_item-thumb">
						<div v-if="item.title" class="dynamic_item-title" v-text="item.title"></div>
						<div v-if="item.detail.summary" class="dynamic_item-content" :class="{ 'dynamic-content36': !item.title}" v-text="item.detail.summary"></div>
					</div>
					<ul v-if="item.detail.pics" class="dynamic_item-pics">
						<li v-for="(pic, index) of getPics(item)" :key="index" class="image--responsive">
							<img :src="pic | imageResize(getPics(item).length > 1 ? 2 : 3)" alt="">
						</li>
					</ul>
					<y-video v-if="item.detail.videoThumbnail" preview :poster="item.detail.videoThumbnail | imageResize(3)" class="dynamic_item-video"></y-video>
				</div>
				<div class="dynamic_item-foot">
					<span v-if="item.detail.rightText3" class="dynamic_item-note" data-position="right-3">
						<span v-if="item.detail.rightIcon3" class="icon" :style="{backgroundImage: `url(${item.detail.rightIcon3})`}"></span>
						<span class="dynamic_item-note-text" v-text="item.detail.rightText3"></span>
					</span>
					<span v-if="item.detail.rightText2" class="dynamic_item-note" data-position="right-2">
						<span v-if="item.detail.rightIcon2" class="icon" :style="{backgroundImage: `url(${item.detail.rightIcon2})`}"></span>
						<span class="dynamic_item-note-text" v-text="item.detail.rightText2"></span>
					</span>
					<span v-if="item.detail.rightText1" class="dynamic_item-note" data-position="right-1">
						<span v-if="item.detail.rightIcon1" class="icon" :style="{backgroundImage: `url(${item.detail.rightIcon1})`}"></span>
						<span class="dynamic_item-note-text" v-text="item.detail.rightText1"></span>
					</span>
					<span v-if="item.detail.leftText" class="dynamic_item-note" data-position="left-1">
						<span v-if="item.detail.leftIcon" class="icon" :style="{backgroundImage: `url(${item.detail.leftIcon})`}"></span>
						<span class="dynamic_item-note-text" v-text="item.detail.leftText"></span>
					</span>
				</div>
			</y-item>
		</y-list>
	</y-load-more>
</template>

<script type="text/javascript">
import LoadMore from '@/components/load-more';
import List from '@/components/list';
import Item from '@/components/item';
import Card from '@/components/card';
import Tag from '@/components/tag';
import Video from '@/components/video';
import ImageResize from '@/filters/imageResize';

export default {
	name: 'y-dynamic-list',

	components: {
		[LoadMore.name]: LoadMore,
		[List.name]: List,
		[Item.name]: Item,
		[Card.name]: Card,
		[Tag.name]: Tag,
		[Video.name]: Video,
	},

	props: {
		good: Boolean,
		author: String,
		dataCache: {
			type: Boolean,
			default: false,
		}
	},

	data() {
		return {
			list: [],
			lastTime: 'last',
			pageSize: 30,
			lastGood: 0,
			state: undefined
		};
	},

	computed: {
		request() {
			let request = {};

			if (this.good) {
				request.url = `/services/app/v1/dynamic/recommend/hot/${this.lastGood}/${this.pageSize}`;
			} else if (this.author) {
				request.url = `/services/app/v1/dynamic/dynamic/${this.author}/${this.lastTime}`;
			} else {
				request.url = `/services/app/v1/dynamic/dynamic/all/${this.lastTime}`;
			}

			return request;
		}
	},

	methods: {
		async load() {
			this.state = 'loading';
			let res = await this.$http(this.request);
			let list = res.data.data;
			let listLength = list.length;

			if (listLength) {
				this.$emit('loaded', list)
				this.list.push(...list);

				// 不足一页的数量
				if (listLength < this.pageSize) {
					this.state = 'end';
				} else {
					this.handleParams();
					this.state = 'prepared';
				}
			} else {
				this.state = 'end';
			}
		},
		// 首页缓存数据
		cacheLoad() {
			this.state = 'loading';
			this.$cache.getData(this.request.url, res => {
				let list = res.data.data;
				let listLength = list.length;

				if (listLength) {
					this.$emit('loaded', list)
					this.list.push(...list);

					// 不足一页的数量
					if (listLength < this.pageSize) {
						this.state = 'end';
					} else {
						this.handleParams();
						this.state = 'prepared';
					}
				} else {
					this.state = 'end';
				}
			})
		},
		getLink(item) {
			return `/redirect/${item.moduleEnum}/${item.moduleId}`;
		},

		getPics(item) {
			let picsString = item.detail.pics;
			return picsString ? picsString.split(',').slice(0, 3) : [];
		},

		handleParams() {
			let lastItem = this.list[this.list.length - 1];

			if (this.good) {
				this.lastGood = this.list.length;
			} else {
				this.lastTime = lastItem.createTime;
			}
		},
	},

	mounted() {
		// 当开启缓存时，用缓存方法替换获取数据方法
		if (this.dataCache) {
			this.cacheLoad();
		} else {
			this.load();
		}
	}
};
</script>

<style type="text/css">
@import '#/css/var.css';

.dynamic_list {
	& .item-wrap {
		padding-top: 0.4rem;
		padding-bottom: 0.4rem;
	}
}

.dynamic_item {
	& .item-wrap {
		display: block;
	}
}

.dynamic_item-head {
	@apply --display-flex;
	justify-content: space-between;
	margin-bottom: 0.3rem;
}

.tag.dynamic_item-label {
	position: relative;
	line-height: 19px;
	color: white;
	background-color: var(--theme-color);
}

.dynamic_item-cover {
	@apply --clearfix;
}

.dynamic_item-thumb {
	float: left;
	width: 2rem;
	height: 1.8rem;
	margin-right: 0.4rem;

	&~.dynamic_item-title {
		line-height: 1.2;
		margin-bottom: 0.1rem;
	}
	&~.dynamic_item-content {
		-webkit-line-clamp: 2;
	}
}

.dynamic_item-title,
.dynamic_item-content {
	@apply --text-cut-multi-line;
	font-size: .36rem;
	line-height: 1.39;
}

.dynamic_item-title {
	-webkit-line-clamp: 2;
	margin-bottom: 0.1rem;

	&~.dynamic_item-content {
		font-size: var(--default-font-size);
		line-height: 1.34;
	}
}

.dynamic_item-content {
	-webkit-line-clamp: 4;
}

.dynamic_item-pics,
.dynamic_item-video,
.dynamic_item-foot {
	margin-top: 0.3rem;
}

.dynamic_item-pics {
	@apply --clearfix;

	&>.image--responsive {
		float: left;
		width: 32.2%;
		padding-bottom: 32.2%;

		&:nth-child(n+2) {
			margin-left: 1.7%;
		}
		&:only-child {
			float: none;
			width: 100%;
			padding-bottom: 44.92%;
		}
	}
}

.dynamic_item-foot {
	@apply --clearfix;

	/* Temporary hidden. */
	display: none;
}

.dynamic_item-note {
	font-size: .24rem;
	line-height: 0.3rem;
	color: var(--text-assist-color);

	&[data-position^="right"] {
		float: right;
		margin-left: 0.3rem;
	}

	&>* {
		vertical-align: middle;
	}
	& .icon {
		width: 0.3rem;
		height: 0.3rem;
		margin-right: 0.58em;
	}
}

.dynamic_item-content.dynamic-content36 {
	font-size: .36rem;
	line-height: 24px;
}
</style>
