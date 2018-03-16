<template>
	<div class="set_nickname">
		<y-nav title="昵称" :beforeBack="goBack">
			<span slot="nav-right">
				<y-publish-button @click.native="handleSave">保存</y-publish-button>
			</span>
		</y-nav>
		<div class="set_input">
			<y-input v-model="setData.nickName" placeholder="请输入昵称"></y-input>
		</div>
	</div>
</template>
<script>
import {YPublishButton} from '@/components/content-publish'
import YInput from '@/components/input'
export default {
	components: {
		YPublishButton,
		YInput
	},
	data() {
		return {
			setData: {}
		}
	},
	created() {
		this.setData = this.$localStore.get('userData').data;
	},
	methods: {
		handleSave() {
			let custInfo = {
				custInfo: {
					custId: this.$env.custId,
					// custId: '42jgbn6u0p',
					custNname: this.setData.nickName
				}
			}
			this.$http.put('/services/app/v1/user/single', custInfo).then(response => {
				if (response.data.code === '200') {
					this.$router.back();
				} else {
					this.$toast(response.data.msg)
				}
			})
		},
		goBack() {
			this.$localStore.remove('userData')
		}
	}
}
</script>
<style>
	.set_nickname{
		& .set_input {
			margin: 0.2rem 0;
			& .y-input-wrap input{
				padding: 0.2rem 0.3rem;
			}
		}
	}
</style>