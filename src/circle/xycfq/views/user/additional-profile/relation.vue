<template>
	<section class="field_page--white">
		<y-nav :title="title"></y-nav>
		<div class="field_page-main">
			<y-check-group type="radio" :data="checkList" @clickItem="handleChecked"></y-check-group>
		</div>
	</section>
</template>

<script type="text/javascript">
	import CheckGroup from '@/components/check-group';

	import mixin from '../../../mixins/form/field-page';

	import 'core-js/fn/string/includes';
	import 'core-js/fn/array/find';

	export default {
		mixins: [
			mixin
		],

		components: {
			[CheckGroup.name]: CheckGroup
		},

		props: {
			typeName: String
		},

		data() {
			return {
				allCheckList: [
					{
						id: 0,
						text: '监护人'
					},
					{
						id: 1,
						text: '父亲'
					},
					{
						id: 2,
						text: '母亲'
					},
					{
						id: 3,
						text: '配偶'
					},
					{
						id: 4,
						text: '父母'
					},
					{
						id: 5,
						text: '直系亲属'
					},
					{
						id: 6,
						text: '同学'
					},
					{
						id: 7,
						text: '子女'
					},
					{
						id: 8,
						text: '同事'
					},
					{
						id: 9,
						text: '其他'
					},
				],
				ids: {
					'xyzx': {
						'contact': [
							1,
							2,
							9,
						]
					},
					'xysx': {
						'contact': [
							1,
							2,
							3,
							9,
						]
					}
				}
			};
		},

		computed: {
			baseCheckList() {
				const fieldName = this.$route.query['field'];
				let ids = [];

				if (fieldName.includes('contact')) {
					ids = this.ids[this.typeName]['contact'];
				} else if (fieldName.includes('family')) {
					ids = this.ids[this.typeName]['family'];
				}

				return ids.map((id) => {
					return this.allCheckList.find((item) => id === item.id);
				});
			}
		}
	};
</script>