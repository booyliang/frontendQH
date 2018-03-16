<template>
	<section>
		<y-nav :title="title"></y-nav>
		<div class="field_page-main">
			<y-auth-upload v-model="localValue" :name="name"></y-auth-upload>
		</div>
	</section>
</template>

<script type="text/javascript">
	import fieldPageMixin from '../../mixins/form/field-page';
	import authUploadPageMixin from '../../mixins/form/auth-upload-page';

	export default {
		mixins: [
			fieldPageMixin,
			authUploadPageMixin
		],
	};
</script>