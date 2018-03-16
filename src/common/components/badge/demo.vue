<template>
	<div class="demo-badge-wrap">
		<y-badge class="demo-badge" :value="22" :max="20">
			<y-button>demo</y-button>
		</y-badge>
		<y-badge class="demo-badge" value="hot">
			<y-button>demo</y-button>
		</y-badge>
	</div>
</template>
<script>
	import YButton from '@/components/button'
	import YBadge from '@/components/badge'
	export default {
		components: {
			YButton,
			YBadge
		}
	}
</script>
<style>
	.demo-badge {
		margin-right: 0.5rem;
	}
</style>
