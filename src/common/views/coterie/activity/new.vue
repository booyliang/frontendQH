<template>
	<div class="coterie-activity-new-wrap">
		<y-nav :title="$R('activity')" :leftText="$R('cancel')" :showLeftArrow="false" :beforeBack="cancelOrBack">
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
			<y-input :maxlength="30" type="textarea" v-model="vm.activityTitle" :placeholder="$R('enter-activity-title')+'...'"></y-input>
		</div>

		<div class="new-list">
			<y-item :title="$R('activity-address')" :value="vm.address" @click.native="toSelect('address')" clickable></y-item>
			<y-item :title="$R('start-time')" :value="startDate" @click.native="open(0)" clickable></y-item>
			<y-item :title="$R('end-time')" :value="endDate" @click.native="open(1)" clickable></y-item>
			<y-item :title="$R('participation-restrictions')">
				<div slot="foot">
					<y-number v-model="vm.signupTotalCount" @change="changeHandle" :min="1" :max="maxCount"></y-number>
				</div>
			</y-item>
		</div>
		<div class="last-new-list">
			<y-editor v-model="vm.contentSource" :imgMaxLength="9" :text-max-length="10000" ref="editor" :placeholder="$R('enter-detail')+'...'"></y-editor>
			<div class="check_rules">
				<y-check type="checkbox" name="checkbox" v-model="vm.checked">{{$R('rules')}}</y-check>
				<span class="rules" @click.stop="toSelect('rules')">《{{$R('activity-rules')}}》</span>
			</div>
			<span class="iconfont icon-key set" @click="toSelect('set')" v-text="$R('permissions')"></span>
		</div>

		<y-date-picker v-model="value" format="Y-M-D h:m" ref="datePicker" @input="changed"></y-date-picker>
	</div>
</template>

<script>
import { YNav } from '@/components/nav';
import YItem from '@/components/item'
import YInput from '@/components/input'
import YNumber from '@/components/number'
import YEditor from '@/components/content-editor'
import YCheck from '@/components/check'
import Toast from '@/components/toast'
import Dialog from '@/components/dialog'
import { YPublishButton, PublishMixin } from "@/components/content-publish"
import DatePicker from '@/components/date-picker';
import moment from 'moment'
export default {
	mixins: [PublishMixin],
	components: {
		Toast, YNav, YEditor, YInput, YNumber, YCheck, YPublishButton,
		[DatePicker.name]: DatePicker
	},
	data() {
		return {
			vm: {
				activityImg: '',
				activityTitle: '',
				activityIntroduction: '',
				activityType: '1',
				moduleEnum: '0221',
				address: '',
				outsideUrl: '',
				shelveFlag: '',
				signupStartDate: '',
				signupEndDate: '',
				activityContent: '',
				contentSource: '[]',
				signupTotalCount: 1,
				allowShareFlag: 1,
				allowGeneralizeFlag: 1,
				checked: true,
			},
			startDate: '',
			endDate: '',
			maxCount: 999,
			targetId: null,
			value: '',
			curDate: moment(new Date()).format('YYYY-MM-DD HH:mm'),
			noStartDate: false,
			noEndDate: false,
		}
	},

	mounted() {
		let _vm = this.$localStore.get('vm');
		if (_vm) {
			this.vm = Object.assign(this.vm, _vm);
			this.startDate = this.vm.signupStartDate;
			this.endDate = this.vm.signupEndDate;
			// this.$utils.alert(this.vm)
			this.$localStore.remove('vm');
		}

		this.noStartDate = this.startDate === '';
		this.noEndDate = this.endDate === '';

	},
	watch: {
		'startDate'(val) {
			this.noStartDate = val === ''
		},
		'endDate'(val) {
			this.noEndDate = val === '';
		}
	},

	methods: {
		cancelOrBack() {
			// 取消或者返回
			var SummaryData = this.$refs.editor.getSummaryData();
			if (this.vm.activityImg || this.vm.activityTitle || this.vm.address
				|| this.startDate || this.endDate || SummaryData.content) {
				Dialog.confirm(
					{ title: '取消发布', message: '是否取消发布活动' },
					{ okText: '确认', cancelText: '取消' }
				).then(() => {
					this.$router.back();
				}).catch(() => {
					return false;
				});
				return false;
			}
			return true;
		},
		uploadImg() {
			this.$yryz.uploadPics({ picNum: 1 }).then(data => {
				this.vm.activityImg = data.picUrls[0];
			})
		},
		toSelect(type) {
			this.vm.signupStartDate = this.startDate;
			this.vm.signupEndDate = this.endDate;
			this.$localStore.set('vm', this.vm);
			if (type === 'rules') {
				if (this.$yryz.isNative()) {
					this.$yryz.openUrl({ url: 'https://static.yryz.com/quanhu/doc/activity_rules/index.html' });
					return false;
				}
				window.location.href = 'https://static.yryz.com/quanhu/doc/activity_rules/index.html';
			} else {
				this.$router.push({ path: `new/${type}` })
			}
		},
		comparison() {
			if (this.noStartDate) return false;
			let curDate = this.parseDate(this.curDate);
			let start = this.parseDate(this.startDate);

			if (start < curDate) {
				this.startDate = '';
				this.value = this.startDate;
				Toast(this.$R('select-start'));
			}
			if (this.noEndDate) return false;
			let end = this.parseDate(this.endDate);
			if (end <= start) {
				this.endDate = '';
				this.value = this.endDate;
				Toast(this.$R('end-more-start'));
			}
		},
		open(type) {
			if (type === 0) {
				this.value = this.noStartDate
					? this.curDate
					: this.startDate;
			} else if (type === 1) {
				this.value = this.noEndDate
					? this.startDate ? this.startDate : this.curDate
					: this.endDate;
			}
			this.targetId = type;
			this.$refs.datePicker.open();
		},
		changed(val) {
			if (this.targetId === 0) this.startDate = val ? val : '';
			if (this.targetId === 1) this.endDate = val ? val : '';
			this.comparison();
		},
		parseDate(str) {
			let arr = str.split(/[- :]/),
				d = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4]);
			return d.getTime();
		},
		changeHandle(num) {
			console.log(num);
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
			if (this.startDate === '') {
				Toast(this.$R('s-start-time'));
				return false;
			}
			if (this.endDate === '') {
				Toast(this.$R('s-end-time'));
				return false;
			}
			var SummaryData = this.$refs.editor.getSummaryData();
			if (SummaryData.content === '') {
				Toast(this.$R('topic-content', 10));
				return false;
			}
			if (SummaryData.content.length < 10 || SummaryData.content.length > 10000) {
				Toast(this.$R('enter-activity-detail'));
				return false;
			}
			this.vm.activityContent = this.vm.contentSource;

			if (!this.vm.checked) {
				Toast('请先阅读并同意《圈乎活动发布规则》');
				return false;
			}
			this.vm.signupStartDate = this.startDate + ':00';
			this.vm.signupEndDate = this.endDate + ':59';
			this.postData = {
				...this.vm,
				...SummaryData,
			}
		},

		/**
		 * 活动发布
		 */
		publish() {
			this.$http.post(`/services/app/v1/coterie/activity/single`, this.postData).then(res => {
				let data = res.data;
				if (data.code === '200') {
					// this.$router.back();
					Toast('发布成功').then(res => {
						// this.publishSuccess(`/coterie/${this.$route.params.coterieId}/activity`);
						this.publishSuccess();
						window.localStorage.setItem('tabId', 'activity');
						this.$router.back();
					})
				} else {
					this.publishError(data.msg);
				}
			}).catch(msg => {
				this.publishError(msg);
			})
		}
	}
}
</script>

<style>
@import '#css/var.css';
.coterie-activity-new-wrap {
	& .upload-fm-img {
		height: 4rem;
		margin-bottom: 0.2rem;

		& .container {
			/* @apply --border; */
			border: 1px solid #BFBFBF;
			background: #F8F8F8;
			text-align: center;
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
		& .item-value {
			padding-left: .3rem;
		}
	}

	& .enter-title {
		& textarea {
			min-height: 1.2rem;
			font-size: 18px;
		}
		& .text-length-info {
			padding-bottom: .2rem;
		}
	}

	& .last-new-list {
		position: relative;
		& .content_editor {
			background: none;
		}
		& .content_editor-view {
			background-color: #FFF;
		}
		& .content_editor-tool {
			margin-top: .9rem;
			background-color: #FFF;
			box-shadow: 0 -2px 15px #d8d8d8;
		}
		& .check_rules {
			position: absolute;
			bottom: 1.3rem;
			left: .3rem;
			& .rules {
				color: var(--theme-color);
				margin-left: -.15rem;
			}
		}
		& .set {
			color: var(--theme-color);
			position: absolute;
			bottom: .3rem;
			right: .3rem;
			padding: .1rem .25rem;
			border-radius: .5rem;
			background-color: #F4F4F4;
			&:before {
				margin-right: .1rem;
			}
		}
	}
}
</style>


