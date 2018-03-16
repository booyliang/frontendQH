<template>
	<div class="vote-detail-demo">
		<y-voting :data="data"></y-voting>
	</div>
</template>
<script>

	import YVoting from '@/components/voting';
	export default {
		components: {
			YVoting
		},
		data() {
			return {
				data: { moduleEnum: "1", id: 1}
			}

		}
	}

</script>