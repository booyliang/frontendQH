<template>
  <y-form v-model="vm" ref="demoForm">
  	<y-form-error></y-form-error>
	<y-form-upload  field="coverImg" required required-errmsg="请上传封面图"></y-form-upload>
	<y-form-input field="title" placeholder="title" @change.native="changeInput" required title="标题" required-errmsg="标题不能为空" :minlength="2" :maxlength="4"></y-form-input>
	<y-form-input field="price" placeholder="price" required title="价格" :regex="/^[0-9]*$/" ></y-form-input>
	<y-form-input field="desc" type="textarea" placeholder="详情" required :minlength="10" :maxlength="100"></y-form-input>
	<y-form-select field="damageStatus" type="checkbox" required title="选择成色" textField="label" required-errmsg="请选择成色" 
	:options-data="optionsData" @change="changeSelect"></y-form-select>
	<y-form-input field="username" :with-label="true" placeholder="请输入姓名" title="姓名" required></y-form-input>
	<y-form-input field="test" :with-label="true" type="textarea" placeholder="多行输入" title="多行输入标题" required :maxlength="50"></y-form-input>
	<y-form-editor ref="demo_editor" field="detailContent" required title="详情" placeholder="填写详情..." :video-enable="true" 
	:audio-enable="true" :text-max-length="200" :minlength="10"></y-form-editor>
	<br>
	<div @click="handleValidate">validate</div>
  </y-form>
</template>
<script>
	import {YFormInput, YForm, YFormSelect, YFormEditor, YFormUpload, YFormError} from '@/components/form'
	export default{
		components: {
			YFormInput,
			YForm,
			YFormSelect,
			YFormEditor,
			YFormUpload,
			YFormError,
		},
		data() {
			return {
				optionsData: [{label: 'Go', id: '1'}, {label: 'JS', id: '2'}, {label: 'Java', id: '3'}],
				vm: {
					coverImg: 'https://avatars3.githubusercontent.com/u/8959119?v=4&s=460',
					title: '你是谁',
					price: '',
					desc: '',
					username: '',
					damageStatus: ['2'],
					detailContent: '[{"text": "You don\'t know JS"}]',
				},
				errorList: [],
			}
		},
		methods: {
			handleValidate() {
				console.log('vm', this.vm);
				let validateResult = this.$refs.demoForm.validate();
				// this.errorList =  this.$refs.demoForm.getErrList(validateResult);
				console.log('validateResult', validateResult)
				// console.log('errorList', this.errorList)
			},
			changeInput(val) {
				console.log('change input value', val);
			},
			changeSelect(val) {
				// console.log('change selct value', val);
			}
		},
	}
</script>
<style>

</style>

