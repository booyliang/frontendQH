<template>
	<div>
		<y-button id="trigger">Open</y-button>
		<blockquote>My name is {{value.name}}.</blockquote>
		<y-picker v-model="value" :selects="selects" :options="options"></y-picker>
	</div>
</template>

<script type="text/javascript">
	import Picker from './';
	import Button from '@/components/button';

	export default {
		components: {
			[Picker.name]: Picker,
			[Button.name]: Button,
		},

		data() {
			return {
				value: {
					name: 'Boring',
					
				},
				selects: [
					{
						name: 'name',
						options: [
							'Boring',
							'Bruce Lee'
						]
					}
				],
				options: {
					trigger: '#trigger'
				}
			};
		},
	};
</script>