<template>
	<div class="demo-number">
		<y-number v-model="demo2" @change="changeHandle" :min="5" :max="15"></y-number>
		{{ demo2 }}
		<y-number :disabled="true" v-model="demo1" @change="changeHandle" :min="5" :max="15"></y-number>
		{{ demo1 }}
	</div>
</template>
<script>
	import YNumber from '@/components/number'
	export default {
		components: {
			YNumber
		},
		data() {
			return {
				demo1: 10,
				demo2: 10
			}
		},
		methods: {
			changeHandle(value) {
				console.log(value);
			}
		}
	}
</script>
