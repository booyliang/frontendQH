<template>
	<div class="activity-new-wrap">
		<y-nav :title="$R('activity-new')">
			<span slot="nav-right">
				<y-publish-button>{{$R('publish')}}</y-publish-button>
			</span>
		</y-nav>
	
		<div class="upload-fm-img">
			<div @click="uploadImg" class="fm-img-container" v-if="vm.activityImg">
				<img :src="vm.activityImg | imageResize(3)" class="fm-img">
				<!-- <img v-if="vm.activityImg" :src="vm.activityImg | imageResize(3)" class="fm-img"> -->
				<span class="fm-img-tips" v-text="$R('change-fm-img')"></span>
			</div>
			<div class="container" @click="uploadImg" v-else>
				<div class="iconfont icon-plus"></div>
				<p>{{$R('upload-fm-img')}}</p>
			</div>
		</div>
	
		<div class="new-list enter-title">
			<y-input :maxlength="30" type="textarea" v-model="vm.activityTitle" :placeholder="$R('publish-activity-name')+'...'"></y-input>
		</div>
	
		<div class="new-list">
			<y-item :title="$R('start-time')" :value="vm.signupStartDate" @click.native="open(0)"></y-item>
			<y-item :title="$R('end-time')" :value="vm.signupEndDate" @click.native="open(1)"></y-item>
			<y-item :title="$R('activity-address')" :value="vm.address" @click.native="toSelect(0)" clickable></y-item>
		</div>
		<div class="new-list">
			<y-item :title="$R('private-circle')" :value="vm.tname" @click.native="toSelect(1)" clickable></y-item>
		</div>
		<div class="new-list">
			<y-input type="textarea" :maxlength="100" v-model="vm.activityIntroduction" :placeholder="$R('activity-intro') + '...'"></y-input>
		</div>
		<div class="last-new-list">
			<y-editor v-model="vm.contentSource" :imgMaxLength="20" :text-max-length="10000" ref="editor" placeholder="活动详情..."></y-editor>
		</div>
	
		<y-date-picker v-model="value" format="Y-M-D h:m" ref="datePicker" @input="changed"></y-date-picker>
	</div>
</template>

<script>
import { YNav } from '@/components/nav';
import YItem from '@/components/item'
import YInput from '@/components/input'
import YEditor from '@/components/content-editor'
import YCheck from '@/components/check'
import Toast from '@/components/toast'
import { YPublishButton, PublishMixin } from "@/components/content-publish"
import DatePicker from '@/components/date-picker';
import moment from 'moment'
export default {
	mixins: [PublishMixin],
	components: {
		Toast, YNav, YEditor, YInput, YCheck, YPublishButton,
		[DatePicker.name]: DatePicker
	},
	data() {
		return {
			vm: {
				activityImg: '',
				activityTitle: '',
				activityIntroduction: '',
				activityType: '1',
				moduleEnum: '0051',
				address: '',
				outsideUrl: '',
				shelveFlag: '',
				signupStartDate: this.$R('s-start-time'),
				signupEndDate: this.$R('s-end-time'),
				icon: '',
				tname: '',
				teamId: '',
				activityContent: '',
				contentSource: '[]',
				// checked: false,
			},
			targetId: null,
			value: '',
			isShowToast: false,
		}
	},

	created() {
		let _vm = this.$localStore.get('vm');
		if (_vm) {
			this.vm = _vm;
			this.$localStore.remove('vm');
		}
		let _imItem = this.$localStore.get('imItem');
		if (_imItem) {
			this.vm.tname = _imItem.tname;
			this.vm.teamId = _imItem.tid;
			this.vm.icon = _imItem.icon;
			this.$localStore.remove('imItem');
		}
		let _address = this.$localStore.get('address');
		if (_address) {
			this.vm.address = _address;
			this.$localStore.remove('address');
		}
	},

	methods: {
		uploadImg() {
			this.$yryz.uploadPics({ picNum: 1 })
				.then(data => {
					this.vm.activityImg = data.picUrls[0];
				})
		},
		toSelect(type) {
			this.$localStore.set('vm', this.vm);
			this.$router.push({ path: `/activity/${type === 0 ? 'address' : 'circle'}` })
		},
		open(id) {
			if (id === 0) {
				if (this.vm.signupStartDate === '' || this.vm.signupStartDate === this.$R('s-start-time')) {
					this.value = moment(new Date()).format('YYYY-MM-DD HH:mm');
				} else {
					this.value = this.vm.signupStartDate;
				}
			} else if (id === 1) {
				if (this.vm.signupEndDate === '' || this.vm.signupEndDate === this.$R('s-end-time')) {
					this.value = moment(new Date()).format('YYYY-MM-DD HH:mm');
				} else {
					this.value = this.vm.signupEndDate;
				}
			} else {
				this.value = moment(new Date()).format('YYYY-MM-DD HH:mm');
			}
			this.targetId = id;
			this.$refs.datePicker.open();
			this.isShowToast = false;
		},
		changed(val) {
			if (this.targetId === 0) {
				this.vm.signupStartDate = this.value ? this.value : this.$R('s-start-time');
			} else if (this.targetId === 1) {
				this.vm.signupEndDate = this.value ? this.value : this.$R('s-end-time');
			}
			if (this.vm.signupStartDate === '' || this.vm.signupStartDate === this.$R('s-start-time')) return false;
			let curDate = this.parseDate(moment(new Date()).format('YYYY-MM-DD hh:mm'));
			let s = this.parseDate(this.vm.signupStartDate);
			if (s < curDate) {
				Toast(this.$R('select-start'));
				this.vm.signupStartDate = this.$R('s-start-time');
			}
			if (this.vm.signupEndDate === '' || this.vm.signupEndDate === this.$R('s-end-time')) return false;

			let e = this.parseDate(this.vm.signupEndDate);
			if (e <= s) {
				if (this.isShowToast) Toast(this.$R('end-more-start'));
				this.vm.signupEndDate = this.$R('s-end-time');
			}
			this.isShowToast = true;
		},
		parseDate(str) {
			let arr = str.split(/[- :]/),
				d = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4]);
			return d.getTime();
		},
		/**
		 * 发布内容效验
		 */
		validate() {
			if (!this.vm.activityImg) {
				Toast(this.$R('p') + this.$R('upload-fm-img'));
				return false;
			}
			if (this.vm.activityTitle === '' || this.vm.activityTitle.length < 4 || this.vm.activityTitle.length > 30) {
				Toast(this.$R('enter-activity-name'));
				return false;
			}
			if (this.vm.address === '') {
				Toast(this.$R('p') + this.$R('fill') + this.$R('activity-address'));
				return false;
			}
			if (this.vm.signupStartDate === '' || this.vm.signupStartDate === this.$R('s-start-time')) {
				Toast(this.$R('s-start-time'));
				return false;
			}
			if (this.vm.signupEndDate === '' || this.vm.signupEndDate === this.$R('s-end-time')) {
				Toast(this.$R('s-end-time'));
				return false;
			}
			if (this.vm.activityIntroduction === '') {
				Toast('请填写活动简介');
				return false;
			}
			if (this.vm.activityIntroduction.length < 20 || this.vm.activityIntroduction.length > 100) {
				Toast(this.$R('enter-activity-intro'));
				return false;
			}
			var SummaryData = this.$refs.editor.getSummaryData();
			if (SummaryData.content === '') {
				Toast('请填写活动详情');
				return false;
			}
			if (SummaryData.content.length < 10 || SummaryData.content.length > 10000) {
				Toast(this.$R('enter-activity-detail'));
				return false;
			}
			this.vm.activityContent = this.vm.contentSource;

			this.vm.signupStartDate += ':00';
			this.vm.signupEndDate += ':59';
			this.postData = {
				...this.vm,
				...SummaryData,
			}
		},

		/**
		 * 活动发布
		 */
		publish() {
			this.$http.post(`/services/app/v1/activity/single`, this.postData)
				.then(res => {
					let data = res.data;
					if (data.msg === 'success') {
						// this.$localStore.set('singup', true);
						this.publishSuccess(`/activity`);
					} else {
						// Toast(this.$R('votePublishError'));
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
</script>

<style>
@import '#css/var.css';
.activity-new-wrap {
	& .upload-fm-img {
		background: #fff;
		height: 4rem;
		margin-bottom: 0.2rem;

		& .container {
			text-align: center;
			background: #F8F8F8;
			padding: 0.2rem 0;
			width: 4.2rem;
			height: 2.2rem;
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
		}
		& .fm-img-container {
			position: relative;
			overflow: hidden;
			width: 100%;
			height: 100%;

			& .fm-img {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
			}
			& .fm-img-tips {
				position: absolute;
				top: .4rem;
				right: .4rem;
				color: #fff;
				@apply --bg-alpha;
				border-radius: 20px;
				padding: .05rem .2rem;
				font-size: 13px;
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

	& .enter-title {
		& .y-input-wrap {
			flex-flow: initial;
			padding: .1rem 0;
			& textarea {
				/* height: .75rem;
				min-height: .75rem;
				resize: none;
				-webkit-appearance: none;
				padding: .12rem .3rem .08rem; */
				height: 0.9rem;
				min-height: 1rem;
				resize: none;
				-webkit-appearance: none;
				padding: .28rem .3rem .8rem;
			}
			& .text-length-info {
				padding-bottom: 0;
			}
		}
	}

	/* & .last-new-list {
		position: relative;
		& .content_editor {
			& .content_editor-tool {
				position: relative;
				top: .8rem;
				background: #fff;
			}
		}
		& .checkbox {
			position: absolute;
			bottom: .4rem;
			width: 100%;
			padding: .1rem 0 .4rem 0;
			background: #F8F8F8;
			& .check {
				margin-left: .3rem;
			}
		}
	} */
}
</style>


