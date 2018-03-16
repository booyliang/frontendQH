<template>
	<div class="place_page">
		<y-nav :title="data.name" :show-search="true" :menuData="['index']"></y-nav>
		<y-panel :title="$R('hot-scenics')" colorful :more="scenicsRoute">
			<y-place-list type="scenic" :fields="scenicsFields"></y-place-list>
		</y-panel>
		<y-panel :title="$R('module-sale')" colorful :more="salesRoute">
			<y-sale-list :end-tip="false" :max-page="1" :page-size="1" :place-id="placeId"></y-sale-list>
			<y-message :icon="emptyIcon" title="暂无相关信息" class="empty_message"></y-message>
		</y-panel>
		<y-panel :title="$R('related-notes')" colorful :more="notesRoute">
			<y-flow-list :request="notesRequest" :max-page="1" :end-tip="false"></y-flow-list>
			<y-message :icon="emptyIcon" title="暂无相关信息" class="empty_message"></y-message>
		</y-panel>
	</div>
</template>

<script type="text/javascript">
	import Panel from '@/components/panel';
	import FlowList from '@/components/flow-list';
	import Message from '@/components/message';
	import PlaceList from '../../components/place-list';
	import SaleList from '../../components/sale-list';

	export default {
		components: {
			[Panel.name]: Panel,
			[PlaceList.name]: PlaceList,
			[FlowList.name]: FlowList,
			[SaleList.name]: SaleList,
			[Message.name]: Message,
		},

		data() {
			return {
				placeId: Number(this.$route.params.placeId),
				data: {},
				scenicsRoute: {
					name: 'place-scenics'
				},
				salesRoute: {
					name: 'sales',
				},
				notesRoute: {
					name: 'notes'
				},
				emptyIcon: '/assets/static/no-content@2x.png'
			};
		},

		computed: {
			scenicsFields() {
				return {
					placeId: this.placeId,
					pageSize: 4
				}
			},
			notesRequest() {
				return {
					url: `/services/app/v1/note/list`,
					params: {
						pageSize: 3,
						placeId: this.placeId
					}
				};
			}
		},

		methods: {
			async initData() {
				this.data = (await this.$http({
					url: `/services/app/v1/destination/single/${this.placeId}`
				})).data.data;
			}
		},

		created() {
			this.initData();
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.place_page {
		& .panel-head {
			line-height: 50px;
			border-bottom: none;
		}
		& .panel-body {
			padding-top: 0;
		}
	}
</style>