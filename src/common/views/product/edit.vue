<template>
	<div class="product-release">
		<y-nav :title="$R('product-publish')" :leftText="$R('cancel')" :beforeBack="goBack" :showLeftArrow="false">
			<span slot="nav-right">
				<y-publish-button>{{$R('product-publish')}}</y-publish-button>
			</span>
		</y-nav>
		<y-input :maxlength="30" :minlength="4" :placeholder="$R('edit-title')" v-model="vm.title"></y-input>
		<y-input type="tel" :placeholder="$R('edit-price')" v-model="vm.price" class="no_right"></y-input>
		<y-input :maxlength="30" :minlength="4" :placeholder="$R('product-contact')" v-model="vm.contactInformation"></y-input>
		<y-list>
			<y-item :title="$R('choose-location')" to='/product/edit-city' v-model="vm.address"></y-item>
			<y-item :title="$R('choose-fineness')" to="/product/edit-fineness" v-model="vm.damageStatustext"></y-item>
			<y-item :title="$R('choose-category')" to="/product/edit-category" v-model="vm.classifyItemName"></y-item>
		</y-list>
		<y-editor v-model="vm.contentSource" :text-max-length="10000" :img-max-length="20" :placeholder="$R('transaction-details')" ref="nativeEditor"></y-editor>
	</div>
</template>
<script>
import { YNav } from '@/components/nav'
import { YPublishButton, PublishMixin } from '@/components/content-publish'
import YInput from '@/components/input'
import YEditor from '@/components/content-editor'
import Dialog from '@/components/dialog'
import Toast from '@/components/toast'
import YList from '@/components/list'
import YItem from '@/components/item'
export default {
	components: {
		YNav,
		YPublishButton,
		YInput,
		YEditor,
		YList,
		YItem,
	},
	mixins: [PublishMixin],
	data() {
		return {
			location: '',
			vm: {
				price: '',
				contactInformation: '',
				title: '',
				address: '',
				damageStatustext: '',
				classifyItemId: '',
				classifyItemName: '',
				coverPlanUrl: '',
				contentSource: '[]',
				damageStatus: '',
			},
			postData: ''
		}
	},
	created() {
		this.initData();
	},
	methods: {
		initData() {
			this.$localStore.getOrSet('productMsg', null, this.vm).then(data => {
				this.vm = data;
			})

		},
		goBack() {
			var summaryData = this.$refs.nativeEditor.getSummaryData();
			if (summaryData.content.length > 0 || this.vm) {
				Dialog.confirm({
					title: "取消发布",
					message: this.$R('product-cancle'),
				},
					{
						okText: this.$R('confirm'),
						cancleText: this.$R('cancel')
					}).then(() => {
						this.$localStore.remove('productMsg')
						this.$router.back();
					}).catch(() => {
						return false;
					})
				return false;
			}
		},
		validate() {
			var summaryData = this.$refs.nativeEditor.getSummaryData();
			var ex = /^[0-9]+$/;
			if (!this.vm.title) {
				Toast(this.$R("enter-title"));
				return false;
			}
			if (this.vm.title.length < 4) {
				Toast(this.$R("min-title"));
				return false;
			}
			if (!this.vm.price) {
				Toast(this.$R("enter-price"));
				return false;
			}
			if (!ex.test(this.vm.price)) {
				Toast(this.$R("ex-price"));
				return false;
			}
			if (!this.vm.contactInformation) {
				Toast(this.$R("enter-contact"));
				return false;
			}
			if (!this.vm.address) {
				Toast(this.$R("choose-locations"));
				return false;
			}
			if (!this.vm.damageStatus) {
				Toast(this.$R("choose-finenesses"));
				return false;
			}
			if (!this.vm.classifyItemId) {
				Toast(this.$R("choose-categorys"));
				return false;
			}
			if (!summaryData.content) {
				Toast(this.$R("enter-content"));
				return false;
			}
			if (summaryData.content.length < 10) {
				Toast(this.$R("min-content"));
				return false;
			}
			if (!summaryData.imgUrl) {
				Toast(this.$R("choose-img"));
				return false;
			}
			this.postData = {
				...summaryData,
				moduleEnum: '0100',
				classifyItemId: this.vm.classifyItemId,
				contactInformation: this.vm.contactInformation,
				damageStatus: this.vm.damageStatustext,
				price: this.vm.price,
				address: this.vm.address,
				title: this.vm.title,
				coverPlanUrl: summaryData.imgUrl.split(',')[0],
				contentSource: this.vm.contentSource
			}
		},
		publish() {
			this.$http.post('/services/app/v1/goods/context/publish', this.postData).then(response => {
				let data = response.data;
				if (data.code === "200") {
					Toast(this.$R("publish-success"));
					this.publishSuccess('/product');
					this.$localStore.remove('productMsg')
				} else {
					this.publishError(data.msg);
				}
			})
		}
	}
}
</script>
<style>
@import '#/css/var.css';

.product-release {
	display: flex;
	flex-direction: column;
	min-height: 100vh;

	& .y-input-wrap,
	& .list {
		@apply --margin-bottom;
	}

	& .content_editor {
		flex: 1;
		display: flex;
		flex-direction: column;

		& .content_editor-view {
			flex: 1;
		}
	}
	& .input-bottom-txt {
		display: none;
	}
}
</style>