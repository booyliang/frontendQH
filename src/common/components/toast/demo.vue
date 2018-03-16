<template>
	<div>
		<y-button @click.native="open">Open</y-button>
	</div>
</template>

<script type="text/javascript">
	import Toast from '@/components/toast';
	import Button from '@/components/button';

	export default {
		components: {
			[Button.name]: Button,
		},

		methods: {
			open() {
				Toast(Math.random())
				.then(() => {
					console.log('Closed.');
				});
			}
		}
	};
</script>