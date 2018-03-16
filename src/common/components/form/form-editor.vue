<template>
  <div class="form_item" >
	  <y-editor v-bind="$props" v-model="vm[field]"></y-editor>
  </div>
</template>
<script>
	import YEditor from '@/components/content-editor'
	import FormBase from './mixin'
	import * as FormValidate from '@/utils/form-validator'
	export default {
		name: 'y-form-editor',
		components: {
			YEditor
		},
		mixins: [FormBase],
		props: {
			...YEditor.props,
		},
		data() {
			return {
				contentVal: ''
			}
		},
		methods: {
			validate() {
				let contentText = '';
				if (this.vm[this.field]) {
					JSON.parse(this.vm[this.field]).filter( (textObj) => {
						contentText += textObj.text;
					})
				}
				let result = {};
				result = FormValidate.validate(contentText, this.$props);
				return result;
			}
		}
	}
</script>
<style>
</style>

