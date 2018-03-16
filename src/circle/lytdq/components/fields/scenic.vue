<template>
	<section>
		<y-nav :title="$R('scenic')">
			<y-button type="text" slot="nav-right" @click.native="handleSave">{{$R('save')}}</y-button>
		</y-nav>
		<y-input :placeholder="$R('scenic-placeholder')" :show-text-length-info="false" v-model="inputtedScenicsString"></y-input>
		<div class="layout">
			<y-check-group type="checkbox" :data="scenics" :max-selected-count="tagsMaxCount" ref="tags" class="check_group--tag"></y-check-group>
		</div>
	</section>
</template>

<script type="text/javascript">
	import Input from '@/components/input';
	import CheckGroup from '@/components/check-group';

	import Validator from '@/utils/validator';

	export default {
		components: {
			[Input.name]: Input,
			[CheckGroup.name]: CheckGroup
		},

		props: {
			placeId: {
				required: true
			}
		},

		data() {
			return {
				lastPlaceId: this.placeId,
				scenics: [],

				// 输入的景点字符串。
				inputtedScenicsString: '',

				checkedScenics: [],
				MAX: 3,
				validator: new Validator({
					scenic: [
						{
							test(value) {
								return value.length && value.every((item) => item.name.length >= 2);
							},

							message: this.$R('scenic-required-error')
						},
						{
							test(value) {
								return value.every((item) => item.name.length <= 8);
							},

							message: this.$R('scenic-max-length-error')
						}
					]
				})
			};
		},

		computed: {
			// 输入的景点字符串组成的数组。
			inputtedScenics() {
				return this.inputtedScenicsString ? this.inputtedScenicsString.split('/') : [];
			},

			tagsMaxCount() {
				return this.MAX - this.inputtedScenics.length;
			},

			resultScenics() {
				return this.getCheckedScenics().concat(this.inputtedScenics).map((item) => {
					return typeof item === 'string' ? {
						name: item
					} : {
						id: item.id,
						name: item.text
					}
				});
			}
		},

		watch: {
			inputtedScenicsString(newValue, oldValue) {
				if (this.resultScenics.length > this.MAX) {
					this.$nextTick(() => {
						this.inputtedScenicsString = oldValue;
					});
				}
			},
		},

		methods: {
			handleSave() {
				this.validator.validate('scenic', this.resultScenics)
				.then(() => {
					this.$emit('save', {
						data: JSON.stringify(this.resultScenics),
						text: this.resultScenics.map((scenic) => {
							return scenic.name;
						}).join('/')
					});
				});
			},

			async initScenics() {
				this.scenics = (await this.$http({
					url: '/services/app/v1/spotscenic/list/1/999',
					params: {
						placeId: this.placeId
					}
				})).data.data.entities.map((scenic) => {
					return {
						id: scenic.id,
						text: scenic.name
					}
				});
			},

			getCheckedScenics() {
				return this.$refs['tags'].getSelectedItems();
			},

			clearScenics() {
				this.scenics = [];
			}
		},

		created() {
			this.initScenics();
		},

		activated() {
			if (this.placeId === this.lastPlaceId) {
				return;
			}

			this.clearScenics();
			this.initScenics();
			this.lastPlaceId = this.placeId;
		}
	};
</script>

<style type="text/css" scoped>
	.y-input {
		margin-bottom: 0.3rem;
	}
</style>