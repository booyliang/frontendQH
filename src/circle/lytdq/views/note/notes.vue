<template>
	<div class="notes_page">
		<y-nav :title="$R('module-note')" :show-search="true" :menuData="['index']"></y-nav>
		<y-slider v-if="topNotes.length" :options="sliderOptions" class="top_notes">
			<router-link v-for="(note, index) of topNotes" :key="index" :to="getTopNoteRoute(note)" class="top_note">
				<div class="image--responsive top_note-image">
					<img :src="note.imgUrl.split(',')[0]" :alt="note.title">
				</div>
				<div class="top_note-title" v-text="note.title"></div>
			</router-link>
		</y-slider>
		<y-tab-bar v-model="tabId" :tabOption="notesCategories"></y-tab-bar>
		<y-tab-container v-model="tabId">
			<y-tab-container-item :id="$R('recommended-notes')">
				<y-flow-list :request="recommendedNotesRequest"></y-flow-list>
			</y-tab-container-item>
			<y-tab-container-item :id="$R('latest-notes')">
				<y-flow-list :request="latestNotesRequest"></y-flow-list>
			</y-tab-container-item>
		</y-tab-container>
		<y-button :to="publishRoute" class="publish-button"></y-button>
	</div>
</template>

<script type="text/javascript">
	import Slider from '@/components/slider';
	import Button from '@/components/button';

	export default {
		components: {
			[Slider.name]: Slider,
			[Button.name]: Button
		},

		data() {
			return {
				placeId: this.$route.params.placeId,
				topNotes: [],
				sliderOptions: {
					slidesPerView: 'auto',
					spaceBetween: 15,
					centeredSlides: true,
					loop: true,
					effect: 'coverflow',
					coverflow: {
						rotate: 0,
						slideShadows: false,
						stretch: -10
					}
				},
				tabId: this.$R('recommended-notes'),
				notesCategories: [
					this.$R('recommended-notes'),
					this.$R('latest-notes'),
				],
				publishRoute: {
					name: 'new-note'
				}
			};
		},

		computed: {
			notesRequest() {
				return {
					url: '/services/app/v1/note/list',
					params: {
						placeId: this.placeId
					}
				};
			},
			recommendedNotesRequest() {
				return Object.assign({}, this.notesRequest, {
					params: Object.assign({}, this.notesRequest.params, {
						orderBy: 'recommend'
					})
				});
			},
			latestNotesRequest() {
				return this.notesRequest;
			},
		},

		methods: {
			async initTopNotes() {
				this.topNotes = (await this.$http({
					url: '/services/app/v1/note/top',
					params: {
						placeId: this.placeId
					}
				})).data.data;
			},

			getTopNoteRoute(note) {
				return {
					name: 'note',
					params: {
						noteId: note.id
					}
				};
			}
		},

		created() {
			this.initTopNotes();
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.notes_page {
		& .top_notes {
			& .swiper-pagination {
				position: static;
				margin-top: 0.2rem;
			}
			& .swiper-pagination-bullet {
				width: 0.16rem;
				height: 0.16rem;
				background: #d7d7d7;
			}
			& .swiper-pagination-bullet-active {
				background: var(--theme-color);
			}
		}
	}
</style>

<style type="text/css" scoped>
	@import "#/css/var.css";

	.top_notes {
		padding: 0.4rem 0;
	}
	.top_note {
		display: block;
		width: 67.2%;
		background: white;
		box-shadow: 0 0 0.2rem color(#bfbfbf alpha(0.5));
	}
	.top_note-image {
		padding-bottom: 56.3%;
	}
	.top_note-title {
		@apply --display-flex;
		@apply --layout;
		justify-content: center;
		text-align: center;
		height: 68px;
		font-size: 16px;
		line-height: 1.4375;
	}
</style>