<template>
	<div class="new_note_page">
		<y-nav :title="$R('publish-note')">
			<y-publish-button slot="nav-right"></y-publish-button>
		</y-nav>
		<div class="new_note_form">
			<y-list>
				<y-item :title="$R('destination')" :to="getFieldRoute('destination')" :value="destination.text"></y-item>
				<y-item v-if="destination.data" :title="$R('scenic')" :to="getFieldRoute('scenic')" :value="scenic.text"></y-item>
			</y-list>
			<y-input :placeholder="$R('input-title')" v-model="title" :maxlength="30"></y-input>
			<y-content-editor :placeholder="$R('input-content')" :text-max-length="10000" :img-max-length="20" v-model="contentSource" ref="editor"></y-content-editor>
		</div>
		<keep-alive>
			<component :is="fieldName" @save="handleSave" :placeId="destination.data" class="field_page"></component>
		</keep-alive>
	</div>
</template>

<script type="text/javascript">
	import {
		YPublishButton as PublishButton,
		PublishMixin as publishMixin,
	} from '@/components/content-publish';
	import List from '@/components/list';
	import Item from '@/components/item';
	import Input from '@/components/input';
	import ContentEditor from '@/components/content-editor';
	import fieldPages from '../../components/fields';

	import Validator from '@/utils/validator';

	export default {
		components: {
			[PublishButton.name]: PublishButton,
			[List.name]: List,
			[Item.name]: Item,
			[Input.name]: Input,
			[ContentEditor.name]: ContentEditor,
			...fieldPages
		},

		mixins: [
			publishMixin
		],

		data() {
			return {
				fieldName: this.$route.params.fieldName,
				destination: {},
				scenic: {},
				title: '',
				contentSource: JSON.stringify([]),
				validator: new Validator({
					destination: [
						{
							rule: 'required',
							message: this.$R('destination-required-error')
						}
					],
					scenic: [
						{
							rule: 'required',
							message: this.$R('scenic-placeholder')
						}
					],
					title: [
						{
							test(value) {
								return value.length >= 4;
							},

							message: this.$R('title-required-error')
						}
					],
					content: [
						{
							test(value) {
								return value.length >= 10;
							},

							message: this.$R('content-min-length-error')
						}
					],
					image: [
						{
							rule: 'required',
							message: this.$R('upload-img')
						}
					]
				})
			};
		},

		watch: {
			destination() {
				this.scenic = {};
			}
		},

		methods: {
			handleSave(value) {
				this[this.fieldName] = value;
				this.$router.back();
			},

			getFieldRoute(fieldName) {
				return {
					name: 'new-note-field',
					params: {
						fieldName
					}
				};
			},

			async validate() {
				try {
					await this.validator.validate([
						{
							name: 'destination',
							value: this.destination.data
						},
						{
							name: 'scenic',
							value: this.scenic.data
						},
						{
							name: 'title',
							value: this.title
						},
						{
							name: 'content',
							value: this.getContent()
						},
						{
							name: 'image',
							value: this.getImage()
						}
					]);
				} catch (error) {
					return false;
				}
			},

			async publish() {
				const body = (await this.$http({
					method: 'POST',
					url: '/services/app/v1/note/single',
					data: {
						moduleEnum: '10071',
						placeId: this.destination.data,
						landscapeSource: this.scenic.data,
						title: this.title,
						contentSource: this.contentSource,
						content: this.getContent(),
						imgUrl: this.getImage()
					}
				})).data;

				if (body.code === '200') {
					this.publishSuccess({
						name: 'notes'
					});
				} else {
					this.publishError(body.msg);
				}
			},

			getContent() {
				return this.$refs['editor'].getSummaryData().content;
			},

			getImage() {
				return this.$refs['editor'].getSummaryData().imgUrl;
			}
		},

		beforeRouteEnter(to, from, next) {
			next((vm) => {
				vm.fieldName = vm.$route.params.fieldName;
			});
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.new_note_page {
		& .content_editor-view {
			padding-bottom: 0;

			& .y-input-wrap {
				height: 8rem;
			}
		}
	}

	.field_page {
		& .check_item {
			@apply --layout;
		}
	}
</style>

<style type="text/css" scoped>
	@import "#/css/var.css";

	.new_note_form {
		margin-top: 0.3rem;

		& .list,
		& .y-input {
			@apply --margin-bottom;
		}
	}

	.field_page {
		@apply --full;
		@apply --scrolling;
		position: fixed;
		z-index: 20;
		background: var(--bg-color);
	}
</style>