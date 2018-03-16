<!-- Author: Boring -->

<template>
	<div :class="classList">
		<router-link v-for="(item, index) of data" :key="index" :to="item.route" class="place_item" :style="{backgroundImage: `url(${item.image})`}">
			<span class="place_item-name" v-text="item.name"></span>
		</router-link>
	</div>
</template>

<script type="text/javascript">
	import LoadMoreRemote from '@/components/load-more-remote';

	export default {
		name: 'y-place-list',

		props: {
			fields: {
				type: Object,

				default() {
					return {};
				}
			},
			type: {
				type: String,
				default: 'place'
			}
		},

		data() {
			return {
				types: {
					'place': {
						request: {
							url: `/services/app/v1/destination/list/0/0`,
						},

						getData(body) {
							return body.data.entities.map((item) => ({
								name: item.name,
								image: item.thumbnail,
								route: {
									name: 'place',
									params: {
										placeId: item.id
									}
								}
							}));
						}
					},
					'scenic': {
						request: {
							url: `/services/app/v1/spotscenic/list/1/:pageSize`,
						},
						class: 'scenic_list',

						getData(body) {
							return body.data.entities.map((item) => ({
								name: item.name,
								image: item.firstImgUrl,
								route: {
									name: 'scenic',
									params: {
										scenicId: item.id
									}
								}
							}));
						}
					}
				},
				data: []
			};
		},

		computed: {
			classList() {
				return [
					'place_list',
					this.types[this.type].class
				];
			},

			request() {
				let defaultRequest = this.types[this.type].request;
				let {
					url,
					params = {}
				} = defaultRequest;
				let fields = Object.assign({
					pageSize: 999
				}, this.fields);

				// 往 url 或 params 里填充参数。
				for (let fieldName in fields) {
					let fieldPlaceholder = `:${fieldName}`;
					let fieldValue = fields[fieldName];

					if (url.includes(fieldPlaceholder)) {
						url = url.replace(fieldPlaceholder, fieldValue);
					} else {
						params[fieldName] = fieldValue;
					}
				}

				return Object.assign({}, defaultRequest, {
					url,
					params
				});
			}
		},

		methods: {
			async initData() {
				let body = (await this.$http(this.request)).data;
				this.data = this.types[this.type].getData(body);
			}
		},

		created() {
			this.initData();
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.place_list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.place_item {
		position: relative;
		flex: none;
		width: 48.6%;
		color: white;
		padding-bottom: 37%;
		background: no-repeat center;
		background-size: cover;

		&:nth-child(n+3) {
			margin-top: 0.2rem;
		}

		& > * {
			position: absolute;
		}
	}
	.place_item-name {
		@apply --full;
		@apply --display-flex;
		justify-content: center;
		font-weight: bold;
		font-size: 22px;
		text-align: center;
		line-height: 1.3;
		padding: 0 1em;
		background: color(black alpha(0.3));
	}

	.scenic_list {
		& .place_item-name {
			display: block;
			font-weight: inherit;
			font-size: 18px;
			line-height: 1.39;
			text-align: left;
			padding: 0.5em 0.6em;
		}
	}
</style>