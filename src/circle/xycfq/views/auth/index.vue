<template>
	<div v-if="typeName">
		<y-nav :title="$route.meta.title"></y-nav>
		<fieldset :disabled="formReadonly" :class="formClassList">
			<y-form-tip v-if="formEditing && userData.unqualifiedMsg" situation="error" icon>{{userData.unqualifiedMsg}}</y-form-tip>
			<y-form-tip v-else icon>为了便于你更快的通过信用赊销额度的审核，请真实、完整填写以下信息。需申请更高赊销额度，请到个人中心补充其他申请资料。</y-form-tip>
			<y-panel title="个人资料（必填）" colorful>
				<y-list>
					<template v-if="typeName === 'xyzx'">
						<y-item :title="fields['name'].title" :class="getFieldClass('name')">
							<y-input slot="body" :placeholder="fields['name'].title | placeholder" v-model="fields['name'].value"></y-input>
						</y-item>
						<y-item :title="fields['id'].title" :class="getFieldClass('id')">
							<y-input slot="body" :placeholder="fields['id'].title | placeholder" v-model="fields['id'].value"></y-input>
						</y-item>
						<y-item :title="fields['school'].title" vertical :class="getFieldClass('school')">
							<y-input slot="body" type="textarea" :placeholder="fields['school'].title | placeholder" v-model="fields['school'].value" :maxlength="20"></y-input>
						</y-item>
						<y-item :title="fields['major'].title" vertical :class="getFieldClass('major')">
							<y-input slot="body" type="textarea" :placeholder="fields['major'].title | placeholder" v-model="fields['major'].value" :maxlength="20"></y-input>
						</y-item>
						<y-item :title="fields['student-card-number'].title" :class="getFieldClass('student-card-number')">
							<y-input slot="body" :placeholder="fields['student-card-number'].title | placeholder" v-model="fields['student-card-number'].value"></y-input>
						</y-item>
						<y-item :title="fields['family-address'].title" vertical :class="getFieldClass('family-address')">
							<y-input slot="body" type="textarea" :placeholder="fields['family-address'].title | placeholder" v-model="fields['family-address'].value" :maxlength="50"></y-input>
						</y-item>
						<y-item :title="fields['debit-card'].title" :class="getFieldClass('debit-card')">
							<y-input slot="body" type="number" :placeholder="fields['debit-card'].title | placeholder" v-model="fields['debit-card'].value"></y-input>
						</y-item>
					</template>
					<template v-else-if="typeName === 'xysx'">
						<y-item :title="fields['name'].title" :class="getFieldClass('name')">
							<y-input slot="body" :placeholder="fields['name'].title | placeholder" v-model="fields['name'].value"></y-input>
						</y-item>
						<y-item :title="fields['id'].title" :class="getFieldClass('id')">
							<y-input slot="body" :placeholder="fields['id'].title | placeholder" v-model="fields['id'].value"></y-input>
						</y-item>
						<y-item :title="fields['debit-card'].title" :class="getFieldClass('debit-card')">
							<y-input slot="body" type="number" :placeholder="fields['debit-card'].title | placeholder" v-model="fields['debit-card'].value"></y-input>
						</y-item>
						<y-item :title="fields['family-address'].title" vertical :class="getFieldClass('family-address')">
							<y-input slot="body" type="textarea" :placeholder="fields['family-address'].title | placeholder" v-model="fields['family-address'].value" :maxlength="50"></y-input>
						</y-item>
						<y-item :title="fields['work'].title" vertical :class="getFieldClass('work')">
							<y-input slot="body" type="textarea" :placeholder="fields['work'].title | placeholder" v-model="fields['work'].value" :maxlength="50"></y-input>
						</y-item>
					</template>
				</y-list>
			</y-panel>
			<y-panel title="证明材料" colorful>
				<y-form-tip>上传以下证明材料。</y-form-tip>
				<y-auth-file-list ref="file-list">
					<y-auth-file-item name="handling-id" :to="getFieldRoute('handling-id')" v-model="fields['handling-id'].value" @click.native="showAlbum" :class="getFieldClass('handling-id')">
						<template slot="title">手持<br>身份证</template>
					</y-auth-file-item>
					<y-auth-file-item name="id-front" :to="getFieldRoute('id-front')" v-model="fields['id-front'].value" @click.native="showAlbum" :class="getFieldClass('id-front')">
						<template slot="title">身份证<br>正面照</template>
					</y-auth-file-item>
					<y-auth-file-item name="id-back" :to="getFieldRoute('id-back')" v-model="fields['id-back'].value" @click.native="showAlbum" :class="getFieldClass('id-back')">
						<template slot="title">身份证<br>反面照</template>
					</y-auth-file-item>
					<y-auth-file-item v-if="typeName === 'xyzx'" name="student-card" :title="fields['student-card'].title" :to="getFieldRoute('student-card')" v-model="fields['student-card'].value" @click.native="showAlbum" :class="getFieldClass('student-card')"></y-auth-file-item>
				</y-auth-file-list>
			</y-panel>
			<y-panel title="手机验证" colorful>
				<y-list>
					<y-item :class="getFieldClass('mobile')" class="form-field--without_label">
						<y-input type="tel" placeholder="请填写手机号" v-model="fields['mobile'].value" slot="body"></y-input>
					</y-item>
					<y-item v-if="!formReadonly" class="form-field--without_label">
						<y-input type="number" placeholder="请填写验证码" v-model="fields['code'].value" slot="body"></y-input>
						<y-button slot="foot" :disabled="inCodeCd" @click.native="sendCode">
							<y-countdown v-if="inCodeCd" v-model="codeCd" start @finish="handleCodeCdFinished"></y-countdown>
							<template v-else>获取验证码</template>
						</y-button>
					</y-item>
				</y-list>
			</y-panel>
			<div class="layout">
				<y-check type="checkbox" name="agreement" v-model="agreed">我已阅读并同意<a href="javascript:;" class="j-agreement-trigger">《信用信息查询授权委托书》</a></y-check>
				<y-button :disabled="!agreed || submitDisabled" size="l" block @click.native="submit" class="form-submit">提交</y-button>
			</div>
		</fieldset>
		<y-modal :options="agreementOptions" class="agreement_modal">
			<article class="agreement">
				<h1 class="agreement-title">《信用信息查询授权委托书》</h1>
				<div class="agreement-content">
					<p>武汉海稻经济发展有限公司：</p>
					<p style="text-indent: 2em;">本人兹授权贵司对本人信用信息进行查询。贵司所查询的信用信息及数据可作为贵方审查本人信用资格的评判依据，并可上传至第三方征信系统数据库。</p>
					<p style="text-indent: 2em;">特此授权。</p>
					<br>
					<p style="text-align: right;">授权人：{{fields['name'].value}}</p>
					<p style="text-align: right;">身份证号：{{fields['id'].value}}</p>
					<p style="text-align: right;">签发日期：{{date.getFullYear()}}年{{date.getMonth() + 1}}月{{date.getDate()}}日</p>
				</div>
			</article>
		</y-modal>
		<component v-if="fieldComponent" :is="fieldComponent" v-model="fields[fieldName].value" :title="fields[fieldName].title" :name="fieldName" :type-name="typeName" class="field_page"></component>
	</div>
</template>

<script type="text/javascript">
	import processFormMixin from '../../mixins/form/process-form';
	import formInUserMixin from '../../mixins/form/form-in-user';
	import formPageMixin from '../../mixins/form';

	import List from '@/components/list';
	import Check from '@/components/check';
	import Modal from '@/components/modal';
	import Countdown from '@/components/countdown';

	const CODE_CD = 60;

	export default {
		mixins: [
			processFormMixin,
			formInUserMixin,
			formPageMixin
		],

		components: {
			[List.name]: List,
			[Check.name]: Check,
			[Modal.name]: Modal,
			[Countdown.name]: Countdown,
		},

		data() {
			return {
				fields: {
					'name': {
						title: '姓名',
						value: '',
						// value: 'Boring Wang',
						apiField: 'name',
						rules: [
							{
								rule: 'required',
								message: '请填写姓名'
							}
						],
					},
					'id': {
						title: '身份证号',
						value: '',
						// value: '420105199008300000',
						apiField: 'idCardNo',
						rules: [
							{
								rule: 'required',
								message: '请填写身份证号'
							},
							'id'
						]
					},
					'school': {
						title: '学校',
						value: '',
						// value: 'Boring University',
						apiField: 'school',
						rules: [
							{
								rule: 'required',
								message: '请填写学校'
							}
						]
					},
					'major': {
						title: '专业',
						value: '',
						// value: 'Computer Science',
						apiField: 'major',
						rules: [
							{
								rule: 'required',
								message: '请填写专业'
							}
						]
					},
					'student-card-number': {
						title: '学生证号',
						value: '',
						// value: '250250',
						apiField: 'studentNo',
						rules: [
							{
								rule: 'required',
								message: '请填写学生证号'
							}
						]
					},
					'family-address': {
						title: '家庭地址',
						value: '',
						// value: 'Boring Road, Wuhan',
						apiField: 'homeAddress',
						rules: [
							{
								rule: 'required',
								message: '请填写家庭地址'
							}
						]
					},
					'debit-card': {
						title: '申请人借记卡号',
						value: '',
						// value: '6666666666666666',
						apiField: 'bankAccount',
						rules: [
							{
								rule: 'required',
								message: '请填写申请人借记卡号'
							}
						]
					},
					'work': {
						title: '工作单位',
						value: '',
						// value: 'Boring Co., Ltd.',
						apiField: 'workUnit',
						rules: [
							{
								rule: 'required',
								message: '请填写工作单位'
							}
						]
					},
					'handling-id': {
						title: '手持身份证',
						value: '',
						// value: 'http://img4.imgtn.bdimg.com/it/u=4207272894,2672939906&fm=26&gp=0.jpg',
						apiField: 'idCardImgHandFront',
						rules: [
							{
								rule: 'required',
								message: '请上传手持身份证'
							}
						]
					},
					'id-front': {
						title: '身份证正面照',
						value: '',
						// value: 'http://img4.imgtn.bdimg.com/it/u=4207272894,2672939906&fm=26&gp=0.jpg',
						apiField: 'idCardImgFront',
						rules: [
							{
								rule: 'required',
								message: '请上传身份证正面照'
							}
						]
					},
					'id-back': {
						title: '身份证反面照',
						value: '',
						// value: 'http://img4.imgtn.bdimg.com/it/u=4207272894,2672939906&fm=26&gp=0.jpg',
						apiField: 'idCardImgReverse',
						rules: [
							{
								rule: 'required',
								message: '请上传身份证反面照'
							}
						]
					},
					'student-card': {
						title: '学生证',
						value: '',
						// value: 'http://img4.imgtn.bdimg.com/it/u=4207272894,2672939906&fm=26&gp=0.jpg',
						apiField: 'studentCardImg',
						rules: [
							{
								rule: 'required',
								message: '请上传学生证'
							}
						]
					},
					'mobile': {
						title: '手机号',
						value: '',
						// value: '15072349345',
						apiField: 'phone',
						rules: [
							{
								rule: 'required',
								message: '请填写手机号'
							},
							'mobile'
						]
					},
					'code': {
						value: '',
						rules: [
							{
								rule: 'required',
								message: '请填写验证码'
							}
						]
					},
				},
				types: {
					'xyzx': {
						apiFields: {
							applyEntry: 1
						},
						requiredFields: [
							'name',
							'id',
							'school',
							'major',
							'student-card-number',
							'family-address',
							'debit-card',
							'handling-id',
							'id-front',
							'id-back',
							'student-card',
							'mobile',
							'code',
						],
					},
					'xysx': {
						apiFields: {
							applyEntry: 2
						},
						requiredFields: [
							'name',
							'id',
							'debit-card',
							'family-address',
							'work',
							'handling-id',
							'id-front',
							'id-back',
							'mobile',
							'code',
						],
					},
				},
				contexts: {
					'xyzx': {
						onSuccess() {
							this.$router.back();
						}
					},
					'xysx': {
						onSuccess() {
							this.$router.back();
						}
					},
					'user': {
						onSuccess() {
							this.$toast('修改成功')
								.then(() => {
									this.$router.back();
								});
						}
					}
				},
				statusField: 'creditStatus',
				agreed: true,
				agreementOptions: {
					trigger: '.j-agreement-trigger'
				},
				inCodeCd: false,
				codeCd: CODE_CD,
				date: new Date(),
			};
		},

		computed: {
			fieldComponent() {
				if (typeof this.fieldName === 'undefined') {
					return;
				}

				return require('../field/upload');
			},
		},

		methods: {
			async sendCode() {
				const mobile = this.fields['mobile'].value;
				await this.validator.validate('mobile', mobile);
				this.inCodeCd = true;
				await this.$openApi({
					method: 'POST',
					url: '/api/v3/user/sendVerifyCode',
					data: {
						type: '1',
						phone: mobile,
						code: '8'
					}
				});
			},

			async submit() {
				await this.validator.validate(this.type.requiredFields.map((field) => ({
					name: field,
					value: this.fields[field].value
				})));

				this.submitDisabled = true;
				const codePassed = (await this.$http({
					method: 'PUT',
					url: '/services/app/v1/sms/verifyCode',
					data: {
						code: '8',
						phone: this.fields['mobile'].value,
						verifyCode: this.fields['code'].value
					}
				})).data.data;

				if (codePassed !== true) {
					this.$toast('验证码错误');
					this.submitDisabled = false;
					return;
				}

				const request = this.formEditing ? {
					method: 'PUT',
					url: '/services/app/v1/flowInfo/data/info'
				} : {
					method: 'POST',
					url: '/services/app/v1/flowInfo/basic/info'
				};
				const data = {
					...this.type.apiFields,
					...this.getApiFields()
				};

				if (this.formEditing) {
					data.id = this.userData.id;
				}

				const body = (await this.$http(Object.assign(request, {
					data
				}))).data;
				this.submitDisabled = false;

				if (body.code === '200') {
					this.context.onSuccess.call(this);
				} else {
					this.$toast(body.msg);
				}
			},

			handleCodeCdFinished() {
				this.codeCd = CODE_CD;
				this.inCodeCd = false;
			},

			doUser() {
				this.agreed = true;
				this.initAlbum();
			},
		},
	};
</script>

<style type="text/css" scoped>
	@import "#/css/var.css";

	.item .button {
		min-height: 2.1em;
		font-size: 14px;
		margin: -0.1rem 0;
	}
</style>