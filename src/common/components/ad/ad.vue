<!-- Author: Boring -->

<template>
	<component v-if="list.length" v-show="visible" :is="component" v-bind="$props" :list="list" :class="classList"></component>
</template>

<script type="text/javascript">
	import SlideAd from './slide-ad';
	import ImageTextAd from './image-text-ad';
	import LargeImageTextAd from './large-image-text-ad';
	import Vue from 'vue';

	let components = {
		1: SlideAd,
		2: ImageTextAd,
		3: LargeImageTextAd,
	};

	export default {
		name: 'y-ad',

		props: {
			type: {
				type: Number,
				required: true
			},
			keyword: {
				type: [
					String,
					Array
				],
				required: true
			},
			at: [
				String,
				Element,
				Vue
			],
			dataCache: {
				type: Boolean,
				default: false
			}
		},

		data() {
			return {
				component: components[this.type],
				list: [],
				inserted: false
			};
		},

		computed: {
			classList() {
				return [
					'ad',
					{
						'ad--no_sign': this.noSign
					}
				];
			},

			noSign() {
				return this.type === 2;
			},

			visible() {
				if (this.at) {
					return this.inserted;
				}

				return true;
			}
		},

		watch: {
			at(newValue) {
				this.beInserted();
			}
		},

		methods: {
			async load() {
				let res = await this.$http({
					url: '/services/app/v1/ad/list',
					params: {
						adType: this.type,
						keyword: this.keyword.toString()
					}
				});
				this.list = res.data.data.entities;

				if (this.list.length && this.at) {
					this.beInserted();
				}
			},
			// 缓存开启时调用的方法
			cacheLoad() {
				this.$cache.getData(`/services/app/v1/ad/list?adType=${this.type}&keyword=${this.keyword.toString()}`, (res) => {
					this.list = res.data.data.entities;

					if (this.list.length && this.at) {
						this.beInserted();
					}
				});
			},
			beInserted() {
				let target = this.getInsertingTarget();

				if (target) {
					this.$nextTick(() => {
						target.insertAdjacentElement('afterend', this.$el);
						this.inserted = true;
					});
				} else {
					setTimeout(() => {
						this.beInserted();
					}, 500);
				}
			},

			getInsertingTarget() {
				if (typeof this.at === 'string') {
					return document.querySelector(this.at);
				} else if (this.at instanceof Element) {
					return this.at;
				} else if (this.at instanceof Vue) {
					return this.at.$el;
				} else {
					console.error('Invalid prop `at`.');
				}
			}
		},

		mounted() {
			// 当开启缓存时，用缓存方法替换获取数据方法
			if (this.dataCache) {
				this.load = this.cacheLoad;
			}
			this.load();
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.ad {
		background: white;

		&::after {
			content: "广告";
			display: inline-block;
			font-size: .24rem;
			color: var(--text-tips-color);
			border: 1px solid;
			padding: 0 0.3em;
			border-radius: 0.3em;
			margin-top: 0.15rem;
			line-height: 1.3;
		}
	}

	.ad--no_sign {
		&::after {
			content: none;
		}
	}
</style>