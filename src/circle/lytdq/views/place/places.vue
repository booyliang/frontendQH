<template>
	<div class="body--white">
		<y-nav :title="$R('module-guide')" :show-search="true" :menuData="['index']"></y-nav>
		<y-tab-bar v-model="tabId" :tabOption="tabs" text-field="name"></y-tab-bar>
		<y-tab-container v-model="tabId">
			<y-tab-container-item v-for="(tab, index) of tabs" :key="index" :id="tab.id">
				<y-place-list :fields="getFields(tab)"></y-place-list>
			</y-tab-container-item>
		</y-tab-container>
	</div>
</template>

<script type="text/javascript">
	import PlaceList from '../../components/place-list';

	export default {
		components: {
			[PlaceList.name]: PlaceList
		},

		data() {
			return {
				tabId: '',
				tabs: []
			};
		},

		computed: {
			tabNames() {
				return this.tabs.map((item) => item.name);
			}
		},

		methods: {
			async initCategories() {
				this.tabs = (await this.$http({
					url: '/services/app/v1/destination/list/0/0',
					params: {
						parentId: 0
					}
				})).data.data.entities;
			},

			getFields(category) {
				return {
					parentId: category.id
				};
			}
		},

		created() {
			this.initCategories();
		}
	};
</script>

<style type="text/css" scoped>
	@import "#/css/var.css";

	.tab-container-item {
		@apply --layout;
		padding-top: 0.4rem;
		padding-bottom: 0.4rem;
	}
</style>