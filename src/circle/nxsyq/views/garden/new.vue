<template>
	<div class="garden_new">
		<y-nav :leftText="$R('cancel')" :beforeBack="handleBack" :showLeftArrow="false" :title="$R('garden-title')">
			<span slot="nav-right">
				<!--<y-publish-button type="text">发布</y-publish-button>-->
				<y-button type="text" @click.native="handlePublish">{{$R('new')}}</y-button>
			</span>
		</y-nav>
		<div class="garden_new-title">
			<y-input :maxlength="30" type="text" :placeholder="$R('title-placeholder')" v-model.trim="title"></y-input>
		</div>
		<div class="garden_new-body">
			<y-editor ref="gardenEditor" v-model="contentSource" :audio-enable="true" :text-max-length="10000" :imgMaxLength="20" :placeholder="$R('garden-new-placeholder')"></y-editor>
		</div>
		
	</div>
</template>
<script>
	import {YNav} from '@/components/nav'
	import Toast from '@/components/toast'
	import YPublishButton from '@/components/content-publish/publish-button';
	import YInput from '@/components/input'
	import YEditor from '@/components/content-editor'
	export default {
		components: {
			YNav, Toast, YPublishButton, YInput, YEditor
		},
		data() {
			return {
				anonymity: 1,
				title: '',
				contentSource: '[]',
			}
		},
		computed: {
			content() {
				return this.$refs.gardenEditor.getSummaryData().content;
			}
		},
		methods: {
			validate() {
				if (this.title.length < 4) {
					Toast(this.$R('garden-title-length', 4));
					return false;
				}
				if (this.content.trim().length < 4) {
					Toast(this.$R('garden-content-length', 4));
					return false;
				}
				return true;
			},
			handlePublish() {
				if (!this.validate()) {
					return false;
				}
				this.$data.content = this.content;
				this.$http.post('/services/app/v1/garden/single', this.$data).then((res) => {
					console.log('res', res);
				})
			},
			handleBack() {
				this.$dialog.confirm({
					message: this.$R('cancel-new'),
				}).then(() => {
					this.$router.back();
				}).catch(() => {
					return false;
				})
				// return false;
			}
		}
	}
</script>
<style>
	.garden_new{

		& .garden_new-title{
			margin-top: 0.2rem;
			& input{
				height: 0.88rem;
				font-size: 18px;
			}
			
		}
		& .garden_new-body{
			margin-top: 0.2rem;
			& textarea{
				font-size: 17px;
			}
		}
	}

</style>