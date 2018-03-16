<template>
	<div class="yryz_barrister">
		<y-nav :title="$R('office-attestation')" :showSearch="true" :showMember="true">
			<span slot="nav-right">
				<y-button type="text" @click.native='submit'>{{$R('lawyer-publish')}}</y-button>
			</span>
		</y-nav>
		<!--基本信息-->
		<y-list>
			<y-item :title="$R('office-pic')" :subtitle="$R('remind-office-pic')" clickable @click="headClick" class="lsq-wrap_item">
				<img v-if='vm.data.lawFirmLogo' slot='foot' :src="vm.data.lawFirmLogo" alt="" />
				<div v-else slot='foot' class="lsq-wrap_item--up">
					<span class="iconfont icon-plus-a"></span>{{$R('office-pic')}}</div>
			</y-item>
			<y-item :title="$R('office-name')" :to='NameLink' v-model='vm.data.lawFirmTitle'></y-item>
			<y-item :title="$R('office-telephone')" :to='TelephoneLink' v-model='vm.data.lawFirmTel'></y-item>
			<y-item :title="$R('linkman-phone')" :to='PhoneLink' v-model='vm.data.linkmanPhone'></y-item>
			<y-item class='hhhh' :title="$R('area')" clickable id='trigger' v-model='areaName'></y-item>
	
			<y-item :title="$R('business-license')" :subtitle="$R('sub-clear')" clickable @click="BarristerClick" class="lsq-wrap_item">
				<img v-if='vm.data.businessLicense' slot='foot' :src="vm.data.businessLicense" alt="" />
				<div v-else slot='foot' class="lsq-wrap_item--up">
					<span class="iconfont icon-plus-a"></span>{{$R('business-license')}}</div>
			</y-item>
			<y-item :title="$R('intro')" :to='IntroLink' v-model='vm.data.introduction'></y-item>
			<y-item :title="$R('case-show')" :subtitle="$R('lawyer-optional')" :to='CaseLink' v-model='vm.data.caseShow'></y-item>
			<y-item :title="$R('website')" :subtitle="$R('lawyer-optional')" :to='UrlLink' v-model='vm.data.lawFirmUrl'></y-item>
			<y-item :title="$R('recruitment-information')" :subtitle="$R('lawyer-optional')" :to='JoinLink' v-model='vm.data.recruitmentInformation'></y-item>
		</y-list>
	
		<div class="submit_button">
			<y-button block @click.native='preview'>{{$R('lawyer-preview')}}</y-button>
		</div>
		<y-picker v-if="province.length>0 && city.length>0" v-model="cityValue" :selects="citySelects" :options="cityOptions" @changed="changed"></y-picker>
	</div>
</template>

<script>
import { YNav } from '@/components/nav'
import { YPublishButton, PublishMixin } from '@/components/content-publish'
import List from '@/components/list';
import Item from '@/components/item';
import Button from '@/components/button';
import Toast from '@/components/toast';
import Dialog from '@/components/dialog';
import Picker from '@/components/picker';

export default {
	components: {
		YNav,
		YPublishButton,
		[List.name]: List,
		[Item.name]: Item,
		[Button.name]: Button,
		[Picker.name]: Picker
	},
	mixins: [PublishMixin],
	data() {
		return {
			headImg: '',
			BarristerImg: '',
			NameLink: { name: 'OfficeName' }, 	// 律所名称
			TelephoneLink: { name: 'OfficeTelephone' },	// 律所电话
			PhoneLink: { name: 'OfficePhone' },	// 手机号
			CityLink: { name: 'LawyerCity' },	// 所在地
			IntroLink: { name: 'OfficeIntro' },	// 个人简介
			CaseLink: { name: 'OfficeCase' },	// 案例展示
			UrlLink: { name: 'OfficeUrl' },	// 网址
			JoinLink: { name: 'OfficeJoin' },	// 招聘信息
			vm: {
				data: {
					businessLicense: "",
					caseShow: "",
					introduction: "",
					lawFirmAddress: "",
					lawFirmLogo: "",
					lawFirmTel: "",
					lawFirmTitle: "",
					lawFirmUrl: "",
					linkmanPhone: "",
					recruitmentInformation: "",
					id: '',
					moduleEnum: '10122'
				},
				someData: {}
			},
			cityData: [],
			province: [],
			city: [],
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
			}
		}
	},
	created() {
		this.initData();
		// 地区列表
		this.$http.get("/services/app/v1/lawyer/authentication/classify/forcefields/1")
			.then(res => {
				if (res.data.code === '200') {
					this.cityData = res.data.data;
					for (let item of this.cityData) {
						this.province.push(item.classification);
					}
					this.city = this.getCityList(this.province[0]);
				}
			})
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
				this.vm.data.lawFirmAddress = this.cityValue.p + ' ' + this.cityValue.c;
				return this.cityValue.p + ' ' + this.cityValue.c;
			} else {
				return '';
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
	},
	methods: {
		getCityList(key) {
			let arr = [];
			for (let item of this.cityData) {
				if (item.classification === key) {
					for (let subItem of item.child) {
						arr.push(subItem.designation);
					}
				}
			}
			return arr;
		},

		changed(newValue) {
			this.city = this.getCityList(newValue.p);
			this.selectValue = newValue;
		},

		// 调用原生上传头像
		headClick() {
			this.$yryz.uploadPics({ picNum: 1 })
				.then((data) => {
					this.vm.data.lawFirmLogo = data.picUrls[0];
				})
		},
		// 上传律师证
		BarristerClick() {
			this.$yryz.uploadPics({ picNum: 1 })
				.then((data) => {
					this.vm.data.businessLicense = data.picUrls[0];
				})
		},
		initData() {
			let request = this.$route.params.id === "0" ? null : { method: 'GET', url: `/services/app/v1/lawyerFirm/getLawyerFirmInfoByUserId/${this.$env.userId}` };
			this.$localStore.getOrSet('petDeta', request, this.vm).then(data => {
				this.vm = data;
				console.log(data);
				if (this.vm.data.lawFirmAddress) {
					let arr = this.vm.data.lawFirmAddress.split(' ');
					console.log(arr);
					this.cityValue = {
						p: arr[0],
						c: arr[1]
					};
					this.city = this.getCityList(arr[0]);
				}
			})
		},
		// 提交认证
		submit() {
			this.vm.data.lawFirmAddress = this.areaName;

			var postData = {
				...this.vm.data
			}

			let listData = {
				businessLicense: postData.businessLicense,
				caseShow: postData.caseShow,
				introduction: postData.introduction,
				lawFirmAddress: postData.lawFirmAddress,
				lawFirmLogo: postData.lawFirmLogo,
				lawFirmTel: postData.lawFirmTel,
				lawFirmTitle: postData.lawFirmTitle,
				lawFirmUrl: postData.lawFirmUrl,
				linkmanPhone: postData.linkmanPhone,
				recruitmentInformation: postData.recruitmentInformation,
				id: postData.id,
				moduleEnum: postData.moduleEnum
			}

			if (!postData.lawFirmLogo) {
				Toast(this.$R('office-pic') + this.$R('not-empty'))
				return false;
			} else if (!postData.lawFirmTitle) {
				Toast(this.$R('office-name') + this.$R('not-empty'))
				return false;
			} else if (!postData.lawFirmTel) {
				Toast(this.$R('office-telephone') + this.$R('not-empty'))
				return false;
			} else if (!postData.linkmanPhone) {
				Toast(this.$R('linkman-phone') + this.$R('not-empty'))
				return false;
			} else if (!postData.lawFirmAddress) {
				Toast(this.$R('area') + this.$R('not-empty'))
				return false;
			} else if (!postData.businessLicense) {
				Toast(this.$R('business-license') + this.$R('not-empty'))
				return false;
			} else if (!postData.introduction) {
				Toast(this.$R('intro') + this.$R('not-empty'))
				return false;
			}

			Dialog.confirm({
				title: this.$R('submit-approve'),
				message: this.$R('submit-confirm'),
			},
				{
					okText: this.$R('yes'),
					cancleText: this.$R('look-again')
				}).then(() => {
					console.log(postData);
					let methods = postData.id ? 'put' : 'post';
					let Murl = postData.id ? '/services/app/v1/lawyerFirm/single' : '/services/app/v1/lawyerFirm/single'
					this.$http[methods](Murl, listData).then((res) => {
						let message = postData.id ? this.$R('modified-authentication') : this.$R('finish-authentication');
						Toast(message);
						this.$router.replace('/office/detail/' + this.$env.userId);
						this.$localStore.remove('petDeta');
					}).catch(err => {
						Toast(err)
					});

				}).catch(() => {
					return false;
				})
			return false;
		},
		// 预览
		preview() {
			this.$router.push({ name: 'OfficePreview' })
		}
	}
}
</script>

<style>

</style>