<template>
	<div class="demo-range">
		<y-range v-model="demoData"></y-range>
		<br>
		<y-range v-model="demoData2" :disabled="true">
			<span slot="start">0</span>
			<span slot="end">100</span>
		</y-range>
	</div>
</template>
<script>
	import YRange from '@/components/range'
	export default {
		components: {
			YRange
		},
		data() {
			return {
				demoData: 0,
				demoData2: 50
			}
		}
	}
</script>
<style>
	.demo-range {
		min-height: 10rem;
	}
</style>

