<template>
	<ul class="auth_file_list">
		<slot></slot>
	</ul>
</template>

<script type="text/javascript">
	export default {
		name: 'y-auth-file-list',
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.auth_file_list {
		display: flex;
	}
</style>