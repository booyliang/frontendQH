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

	export default {
		mixins: [
			mixin
		],

		components: {
			[CheckGroup.name]: CheckGroup
		},

		data() {
			return {
				baseCheckList: [
					{
						id: 1,
						text: '一年级'
					},
					{
						id: 2,
						text: '二年级'
					},
					{
						id: 3,
						text: '三年级'
					},
					{
						id: 4,
						text: '四年级'
					},
				]
			};
		},
	};
</script>