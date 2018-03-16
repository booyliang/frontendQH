<template>
	<div class="new-wrap">
		<y-nav :title="$R('publish-merchant')" :leftText="$R('cancel')" :showLeftArrow="false">
			<span slot="nav-right">
				<y-publish-button>{{$R('publish')}}</y-publish-button>
			</span>
		</y-nav>
	
		<div class="upload-fm-img">
			<div class="container" @click="uploadImg">
				<div class="iconfont icon-plus"></div>
				<p>{{$R('upload-fm-img')}}</p>
				<img v-if="vm.coverPlanUrl" :src="vm.coverPlanUrl | imageResize(5)" class="fm-img">
			</div>
		</div>
	
		<div class="new-list">
			<y-input v-model="vm.name" :maxlength="20" :placeholder="$R('enter-merchant-name')"></y-input>
		</div>
		<div class="new-list">
			<y-item :title="areaName" :clickable="true" id="trigger"></y-item>
			<y-item :title="classifyName" :clickable="true" id="trigger1"></y-item>
		</div>
		<div class="new-list">
			<y-input v-model="vm.address" type="textarea" :maxlength="30" :placeholder="$R('enter-merchant-addr')"></y-input>
		</div>
		<div class="new-list">
			<y-input v-model="vm.phone" type="number" :show-text-length-info="false" :placeholder="$R('enter-contact')"></y-input>
		</div>
	
		<div class="new-list activity-list">
			<ul>
				<li v-for="(item,index) of vm.activitys" :key="index">
					<y-input v-model="item.name" type="textarea" :maxlength="20" :placeholder="$R('enter-activity-name',10)"></y-input>
					<y-input v-model="item.url" type="textarea" :maxlength="10000" :placeholder="$R('enter-activity-url')"></y-input>
				</li>
			</ul>
			<div class="act-tip">
				<span class="iconfont icon-tips"></span>
				<span>{{$R('activity-tip',10)}}</span>
			</div>
			<div class="act-but">
				<span class="remove but" @click="removeActivity">
					<span class="iconfont icon-plus-o"></span>
					<span>{{$R('remove-activity')}}</span>
				</span>
				<span class="add but" @click="addActivity">
					<span class="iconfont icon-plus-circle"></span>
					<span>{{$R('add-activity')}}</span>
				</span>
			</div>
		</div>
	
		<y-picker v-if="province.length>0 && city.length>0" v-model="cityValue" :selects="citySelects" :options="cityOptions" @changed="changed"></y-picker>
		<y-picker v-model="classifyValue" :selects="classifySelects" :options="classifyOptions"></y-picker>
	
		<y-editor v-model="vm.contentSource" :imgMaxLength="20" :video-enable="true" :text-max-length="10000" ref="editor" :placeholder="$R('enter-merchant-detail',10)"></y-editor>
	
	</div>
</template>

<script>
import YItem from '@/components/item'
import YInput from '@/components/input'
import YEditor from '@/components/content-editor'
import Toast from '@/components/toast'
import { YPublishButton, PublishMixin } from "@/components/content-publish"
import Picker from '@/components/picker';
import provinces from '@/js/citydata'
export default {
	components: {
		YItem, YInput, YEditor, Toast, YPublishButton,
		[Picker.name]: Picker,
	},
	mixins: [PublishMixin],
	data() {
		return {
			vm: {
				coverPlanUrl: '',
				name: '',
				province: '',
				city: '',
				classifyId: '',
				address: '',
				phone: '',
				activitys: [],
				contentSource: '[]',
			},
			status: this.$route.params.status,

			cityData: provinces,
			province: [],
			city: [],
			classifyData: this.$localStore.get('classifyData'),
			selectValue: {
				p: '',
				c: ''
			},

			cityValue: {
				p: '',
				c: ''
			},
			cityOptions: {
				trigger: '#trigger'
			},

			classifyValue: {
				name: '',
			},
			classifyOptions: {
				trigger: '#trigger1'
			}
		}
	},
	created() {
		// console.log(this.$localStore.get('sellId'));
		// console.log(this.cityData);
		for (let item of this.cityData) {
			this.province.push(item.text);
		}
		if (this.status === '1') {
			this.$http.get(`/services/app/v1/business/single/${this.$localStore.get('sellId')}`)
				.then(res => {
					if (res.data.code === '200') {
						let data = res.data.data;
						this.vm = {
							coverPlanUrl: data.coverPlanUrl,
							name: data.name,
							province: data.province,
							city: data.city,
							classifyId: data.classifyId,
							address: data.address,
							phone: data.phone,
							activitys: data.activitys,
							contentSource: data.contentSource,
						}
						this.cityValue = {
							p: data.province,
							c: data.city
						};
						this.classifyValue = {
							name: this.getClassifyName(data.classifyId),
						};

						this.city = this.getCityList(data.province);
					}
				})
		} else {
			this.city = this.getCityList(this.province[0]);
		}
	},
	watch: {
		'cityValue'(val) {
			this.$nextTick(() => {
				if (this.selectValue.c) {
					this.cityValue.c = this.selectValue.c;
				}
			})
		}
	},
	computed: {
		areaName() {
			if (this.cityValue.p) {
				this.vm.province = this.cityValue.p;
				this.vm.city = this.cityValue.c;
				return this.cityValue.p + '，' + this.cityValue.c;
			} else {
				return this.$R('enter-merchant-area');
			}
		},

		classifyName() {
			if (this.classifyValue.name) {
				this.vm.classifyId = this.getClassifyId(this.classifyValue.name);
				return this.classifyValue.name;
			} else {
				return this.$R('enter-merchant-classify');
			}
		},

		citySelects() {
			let arr = [
				{
					name: 'p',
					options: this.province
				},
				{
					name: 'c',
					options: this.city
				}]
			return arr;
		},

		classifySelects() {
			let arr = [];
			let obj = {
				name: 'name',
				options: []
			}
			for (let item of this.classifyData) {
				obj.options.push(item.name);
			}
			arr.push(obj);
			return arr;
		}
	},

	methods: {
		uploadImg() {
			this.$yryz.uploadPics({ picNum: 1 })
				.then(data => {
					this.vm.coverPlanUrl = data.picUrls[0];
				})
		},

		getCityList(key) {
			let arr = [];
			for (let item of this.cityData) {
				if (item.text === key) {
					for (let subItem of item.children) {
						arr.push(subItem.text);
					}
				}
			}
			return arr;
		},

		changed(newValue) {
			// console.log('changed', newValue);
			this.city = this.getCityList(newValue.p);
			this.selectValue = newValue;
		},

		getClassifyName(id) {
			for (let item of this.classifyData) {
				if (item.id === id) {
					return item.name;
				}
			}
		},
		getClassifyId(name) {
			for (let item of this.classifyData) {
				if (item.name === name) {
					return item.id;
				}
			}
		},

		removeActivity() {
			this.vm.activitys.splice(this.vm.activitys.length - 1, 1);
		},
		addActivity() {
			let isEmpty = false;
			if (this.vm.activitys.length > 0) {
				for (let item of this.vm.activitys) {
					if (item.name === '' || item.url === '')
						isEmpty = true;
				}
				if (isEmpty) {
					Toast(this.$R('toast-activity-info'));
					return false;
				}
				if (this.vm.activitys.length >= 10) {
					Toast(this.$R('toast-max-activity-num', 10));
					return false;
				}
				this.vm.activitys.push({
					name: '',
					url: ''
				})
			} else {
				this.vm.activitys.push({
					name: '',
					url: ''
				})
			}
		},

		/**
		 * 发布内容效验
		 */
		validate() {
			if (this.vm.coverPlanUrl === '') {
				Toast(this.$R('toast-upload'));
				return false;
			}
			if (this.vm.name === '') {
				Toast(this.$R('toast-name', 4));
				return false;
			}
			if (this.vm.province === '' || this.vm.city === '') {
				Toast(this.$R('toast-area'));
				return false;
			}
			if (this.vm.classifyId === '') {
				Toast(this.$R('toast-classity'));
				return false;
			}
			if (this.vm.address === '') {
				Toast(this.$R('toast-addr', 4));
				return false;
			}
			if (this.vm.activitys.length > 0) {
				for (let item of this.vm.activitys) {
					if (item.name === '' || item.url === '') {
						Toast(this.$R('toast-activity-info'));
						return false;
					}
				}
			}
			// this.vm.phone === '' || !/^1[3|4|5|7|8|9]\d{9}$/.test(this.vm.phone)
			if (this.vm.phone === '') {
				Toast(this.$R('toast-contact'));
				return false;
			}


			var SummaryData = this.$refs.editor.getSummaryData();
			if (SummaryData.content === '' || SummaryData.content.length < 10) {
				Toast(this.$R('toast-comment', 10));
				return false;
			}

			this.postData = {
				...this.vm,
				...SummaryData,
				moduleEnum: '10151',
			}
			if (this.status === '1')
				this.postData.id = this.$localStore.get('sellId');
		},

		/**
		 * 活动发布
		 */
		publish() {
			if (this.status === '0') {
				this.$http.post(`/services/app/v1/business/single`, this.postData)
					.then(res => {
						let data = res.data;
						if (data.msg === 'success') {
							this.publishSuccess(`/sell/index`);
						} else {
							// Toast(this.$R('votePublishError'));
							this.publishError(data.msg);
						}
					})
					.catch(msg => {
						this.publishError(msg);
						// Toast(this.$R('public-failed'));
					})
			} else {
				this.$http.put(`/services/app/v1/business/single`, this.postData)
					.then(res => {
						let data = res.data;
						if (data.msg === 'success') {
							this.publishSuccess(`/sell/mysell`);
						} else {
							// Toast(this.$R('public-failed'));
							this.publishError(data.msg);
						}
					})
					.catch(msg => {
						this.publishError(msg);
						// Toast(this.$R('public-failed'));
					})
			}

		}
	}
}
</script>
<style>
.new-wrap {
	& .upload-fm-img {
		background: #fff;
		height: 4rem;
		margin-bottom: 0.2rem;
		& .container {
			text-align: center;
			background: #F8F8F8;
			padding: 0.2rem 0;
			width: 4.2rem;
			height: 2rem;
			margin: auto;
			position: relative;
			top: 1rem;
			border-radius: 0.1rem;
			overflow: hidden;
			& .iconfont {
				font-size: 40px;
				color: #BFBFBF;
			}

			& p {
				color: #666;
			}

			& .fm-img {
				position: absolute;
				width: 100%;
				top: 0;
				left: 0;
			}
		}
	}
	& .new-list {
		margin-bottom: 0.2rem;
		& .y-textarea {
			& textarea {
				/*min-height: 0;*/
			}
		}
	}

	& .activity-list {
		& .act-tip {
			padding: 0.2rem;
			color: #9B9B9B;
		}

		& .act-but {
			text-align: center;
			margin: 0.4rem 0;


			& .but {
				padding: 0.15rem 0.3rem;
				border-radius: 0.15rem;
				margin: 0 0.1rem;
				font-size: 20px;
				& .iconfont {
					margin: 0 0.1rem;
				}
			}
			& .remove {
				border: 0.01rem solid #D7D7D7;
				color: #999;
			}
			& .add {
				border: 0.01rem solid #DC8130;
				color: #DC8130;
			}
		}

		& .act-list {
			& li {
				border-bottom: 0.01rem solid #F8F8F8;
			}
		}
	}
	& .content_editor {
		& .content_editor-view {
			padding: 0;
			& .y-textarea {
				& textarea {
					/*min-height: 0;*/
				}
			}
		}
	}
}
</style>
