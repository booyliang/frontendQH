<template>
	<div>
		<y-item title="Birthday" :value="value" id="trigger"></y-item>
		<y-date-picker v-model="value" format="Y-M-D h:m:s" :options="options" ref="picker"></y-date-picker>
	</div>
</template>

<script type="text/javascript">
	import DatePicker from './';
	import Item from '@/components/item';

	export default {
		components: {
			[DatePicker.name]: DatePicker,
			[Item.name]: Item,
		},

		data() {
			return {
				value: '1990-08-30 12:40:00',
				options: {
					trigger: '#trigger'
				}
			};
		},
	};
</script>