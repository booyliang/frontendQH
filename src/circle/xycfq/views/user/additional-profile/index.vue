<template>
	<div v-if="typeName">
		<y-nav :title="$route.meta.title"></y-nav>
		<fieldset :disabled="formReadonly" :class="formClassList">
			<y-form-tip v-if="status === 0" icon>需申请更高赊销额度，请补充其他申请资料，补充资料一旦审核通过不可再次更改。</y-form-tip>
			<y-form-tip v-else-if="formEditing && userData.unqualifiedMsg" situation="error" fixed icon>{{userData.unqualifiedMsg}}</y-form-tip>
			<y-form-tip v-else-if="status === 5" fixed icon>审核不通过。</y-form-tip>
			<y-form-tip v-else-if="status === 6" fixed icon>审核通过，<router-link to="/user/credit">去个人中心查看额度</router-link>。</y-form-tip>
			<y-form-tip v-else fixed icon>已提交，等待审核中…</y-form-tip>
			<y-panel title="补充个人资料" colorful>
				<y-list>
					<template v-if="typeName === 'xyzx'">
						<y-item :title="fields['grade'].title" :value="getFieldText('grade')" :to="getFieldRoute('grade')" :class="getFieldClass('grade')"></y-item>
					</template>
					<template v-else-if="typeName === 'xysx'">
						<y-item :title="fields['social-security'].title" :class="getFieldClass('social-security')">
							<y-input slot="body" :placeholder="fields['social-security'].title | placeholder" v-model="fields['social-security'].value"></y-input>
						</y-item>
						<y-item :title="fields['housing-fund'].title" :class="getFieldClass('housing-fund')">
							<y-input slot="body" :placeholder="fields['housing-fund'].title | placeholder" v-model="fields['housing-fund'].value"></y-input>
						</y-item>
					</template>
					<y-item :title="fields['email'].title" :class="getFieldClass('email')">
						<y-input slot="body" type="email" :placeholder="fields['email'].title | placeholder" v-model="fields['email'].value"></y-input>
					</y-item>
				</y-list>
			</y-panel>
			<y-panel title="紧急联系人（限家庭主要成员）资料" colorful>
				<y-list>
					<y-item :title="fields['contact-relation'].title" :value="getFieldText('contact-relation')" :to="getFieldRoute('contact-relation')" :class="getFieldClass('contact-relation')"></y-item>
					<y-item :title="fields['contact-name'].title" :class="getFieldClass('contact-name')">
						<y-input slot="body" :placeholder="fields['contact-name'].title | placeholder('紧急联系人')" v-model="fields['contact-name'].value"></y-input>
					</y-item>
					<y-item :title="fields['contact-work'].title" :class="getFieldClass('contact-work')">
						<y-input slot="body" :placeholder="fields['contact-work'].title | placeholder('紧急联系人')" v-model="fields['contact-work'].value"></y-input>
					</y-item>
					<y-item :title="fields['contact-contact'].title" :class="getFieldClass('contact-contact')">
						<y-input slot="body" type="tel" placeholder="请输入手机号或固定电话" v-model="fields['contact-contact'].value" :maxlength="13"></y-input>
					</y-item>
				</y-list>
			</y-panel>
			<y-panel v-if="typeName === 'xysx'" title="资产证明资料" colorful>
				<y-auth-file-list ref="file-list">
					<y-auth-file-item name="house-1" :title="fields['house-1'].title" :to="getFieldRoute('house-1')" v-model="fields['house-1'].value" @click.native="showAlbum" :class="getFieldClass('house-1')"></y-auth-file-item>
					<y-auth-file-item name="house-2" :title="fields['house-2'].title" :to="getFieldRoute('house-2')" v-model="fields['house-2'].value" @click.native="showAlbum" :class="getFieldClass('house-2')"></y-auth-file-item>
					<y-auth-file-item name="car-1" :title="fields['car-1'].title" :to="getFieldRoute('car-1')" v-model="fields['car-1'].value" @click.native="showAlbum" :class="getFieldClass('car-1')"></y-auth-file-item>
					<y-auth-file-item name="car-2" :title="fields['car-2'].title" :to="getFieldRoute('car-2')" v-model="fields['car-2'].value" @click.native="showAlbum" :class="getFieldClass('car-2')"></y-auth-file-item>
				</y-auth-file-list>
			</y-panel>
			<y-button block size="l" @click.native="submit" :disabled="submitDisabled" class="form-submit">提交</y-button>
		</fieldset>
		<component v-if="fieldComponent" :is="fieldComponent" v-model="fields[fieldName].value" :title="fields[fieldName].title" :name="fieldName" :type-name="typeName" class="field_page"></component>
	</div>
</template>

<script type="text/javascript">
	import processFormMixin from '../../../mixins/form/process-form';
	import formInUserMixin from '../../../mixins/form/form-in-user';
	import formPageMixin from '../../../mixins/form';

	import List from '@/components/list';

	import 'core-js/fn/array/includes';

	export default {
		mixins: [
			processFormMixin,
			formInUserMixin,
			formPageMixin
		],

		components: {
			[List.name]: List,
		},

		data() {
			return {
				fields: {
					'grade': {
						title: '年级',
						value: '',
						apiField: 'grade',

						display(value) {
							return ({
								1: '一年级',
								2: '二年级',
								3: '三年级',
								4: '四年级',
							})[value];
						}
					},
					'social-security': {
						title: '社保卡号',
						value: '',
						apiField: 'medicalCardNo',
					},
					'housing-fund': {
						title: '公积金卡号',
						value: '',
						apiField: 'providentFundNo',
					},
					'email': {
						title: '邮箱',
						value: '',
						apiField: 'email',
						rules: [
							'email'
						]
					},
					'contact-relation': {
						title: '与申请人关系',
						value: '',
						apiField: 'contactRelation',

						display(value) {
							return ({
								0: '监护人',
								1: '父亲',
								2: '母亲',
								3: '配偶',
								4: '父母',
								5: '直系亲属',
								6: '同学',
								7: '子女',
								8: '同事',
								9: '其他',
							})[value];
						}
					},
					'contact-name': {
						title: '姓名',
						value: '',
						apiField: 'contactName',
					},
					'contact-work': {
						title: '工作单位',
						value: '',
						apiField: 'contactWorkUnit',
					},
					'contact-contact': {
						title: '联系方式',
						value: '',
						apiField: 'contactPhone',
						rules: [
							{
								rule: 'number',
								message: '紧急联系人联系方式必须是手机号或固定电话'
							}
						]
					},
					'house-1': {
						title: '房产证明 1',
						value: '',
						apiField: 'houseCertificateImg',
					},
					'house-2': {
						title: '房产证明 2',
						value: '',
						apiField: 'houseCertificateImg2',
					},
					'car-1': {
						title: '车辆证明 1',
						value: '',
						apiField: 'carCertificateImg',
					},
					'car-2': {
						title: '车辆证明 2',
						value: '',
						apiField: 'carCertificateImg2',
					},
				},
				types: {
					'xyzx': {},
					'xysx': {},
				},
				statusField: 'creditSupplyStatus',
			};
		},

		computed: {
			fieldComponent() {
				let componentName = this.fieldName;

				if (typeof componentName === 'undefined') {
					return;
				}

				let componentPath = '';

				if ([
					'contact-relation'
				].includes(componentName)) {
					return require('./relation');
				} else if ([
					'house-1',
					'house-2',
					'car-1',
					'car-2',
				].includes(componentName)) {
					return require('../../field/upload');
				}

				return require(`./${componentName}`);
			},

			fieldsWithRules() {
				return Object.keys(this.fields).filter((fieldName) => this.fields[fieldName].hasOwnProperty('rules'));
			}
		},

		methods: {
			// toCamel(string) {
			// 	return string.replace(/-(\w)/g, (match, capture) => {
			// 		return capture.toUpperCase();
			// 	});
			// }

			async submit() {
				await this.validator.validate(this.fieldsWithRules.map((fieldName) => ({
					name: fieldName,
					value: this.fields[fieldName].value
				})));

				this.submitDisabled = true;
				const body = (await this.$http({
					method: 'PUT',
					url: '/services/app/v1/flowInfo/basic/supply',
					data: {
						id: this.userData.id,
						...this.getApiFields()
					}
				})).data;
				this.submitDisabled = false;

				if (body.code === '200') {
					this.$toast('提交成功')
						.then(() => {
							this.$router.back();
						});
				} else {
					this.$toast(body.msg);
				}
			},

			doUser() {
				this.initAlbum();
			}
		},
	};
</script>