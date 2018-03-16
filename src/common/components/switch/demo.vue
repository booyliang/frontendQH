<template>
	<y-list>
		<y-item title="Switch (off)">
			<y-switch slot="foot" v-model="on1"></y-switch>
		</y-item>
		<y-item title="Switch (on)">
			<y-switch slot="foot" v-model="on2"></y-switch>
		</y-item>
		<y-item title="Switch (off, disabled)">
			<y-switch slot="foot" :value="false" disabled></y-switch>
		</y-item>
		<y-item title="Switch (on, disabled)">
			<y-switch slot="foot" :value="true" disabled></y-switch>
		</y-item>
	</y-list>
</template>

<script>
	import List from '@/components/list';
	import Item from '@/components/item';
	import Switch from './';

	export default {
		components: {
			[List.name]: List,
			[Item.name]: Item,
			[Switch.name]: Switch
		},

		data() {
			return {
				on1: false,
				on2: true
			};
		}
	};
</script>