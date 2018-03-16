<template>
	<section>
		<y-nav :title="$R('destination')"></y-nav>
		<y-tab-bar v-model="activeCategory" :tabOption="categories" :enable-router="false" text-field="name"></y-tab-bar>
		<y-tab-container v-model="activeCategory">
			<y-tab-container-item v-for="(category, index) of categories" :key="index" :id="category.id">
				<y-check-group v-if="places[category.id]" type="radio" :data="places[category.id]" @clickItem="handleSelected"></y-check-group>
			</y-tab-container-item>
		</y-tab-container>
	</section>
</template>

<script type="text/javascript">
	import CheckGroup from '@/components/check-group';

	export default {
		components: {
			[CheckGroup.name]: CheckGroup
		},

		data() {
			return {
				activeCategory: '',
				categories: [],
				places: {}
			};
		},

		computed: {
			tabNames() {
				return this.categories.map((item) => item.name);
			}
		},

		methods: {
			async initCategories() {
				this.categories = (await this.$http({
					url: '/services/app/v1/destination/list/0/0',
					params: {
						parentId: 0
					}
				})).data.data.entities;
			},

			initPlaces() {
				this.categories.forEach(async (category) => {
					const places = (await this.$http({
						url: '/services/app/v1/destination/list/0/0',
						params: {
							parentId: category.id
						}
					})).data.data.entities.map((place) => ({
						id: place.id,
						text: place.name,
					}));
					this.$set(this.places, category.id, places);
				});
			},

			handleSelected(item) {
				this.$emit('save', {
					data: item.id,
					text: item.text
				});
			}
		},

		async created() {
			await this.initCategories();
			this.initPlaces();
		}
	};
</script>

<style type="text/css" scoped>
	.field_page {
		background: white;
	}
</style>