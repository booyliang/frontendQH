<template>
	<div class="mood_demo">
		<y-mood :data="data"></y-mood>
	</div>
</template>
<script>
	import YMood from '@/components/mood'
	export default {
		components: {
			YMood
		},
		data() {
			return {
				data: {
					moduleEnum: "0091",
					id: 1,
					moodFlag: 1,
				}
			}
		}
	}
</script>