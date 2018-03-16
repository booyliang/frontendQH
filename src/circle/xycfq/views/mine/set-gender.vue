<template>
	<div class="set_gender">
		<y-nav title="性别" :beforeBack="goBack">
			<span slot="nav-right">
				<y-publish-button @click.native="handleSave">完成</y-publish-button>
			</span>
		</y-nav>
		<y-check-group :data="listData" type="radio" ref="checkList"></y-check-group>
	</div>
</template>

<script type="text/javascript">
import YCheckGroup from '@/components/check-group'
import {YPublishButton} from '@/components/content-publish'
export default {
	components: {
		YCheckGroup,
		YPublishButton
	},
	data() {
		return {
			listData: [
				{
					id: '0',
					text: '女'
				},
				{
					id: '1',
					text: '男'
				},
			],
			setData: {}
		};
	},
	created() {
		this.setData = this.$localStore.get('userData').data;
		for (let item of this.listData) {
			if (this.setData.sex === item.id) {
				item.checked = true;
			}
		}
	},
	methods: {
		handleSave() {
			let item = this.$refs.checkList.getSelectedItems()[0];
			let custInfo = {
				custInfo: {
					// custId: this.$env.custId,
					custId: '42jgbn6u0p',
					custSex: item.id
				}
			}
			this.$http.put('/services/app/v1/user/single', custInfo).then(response => {
				if (response.data.code === '200') {
					this.setData.sex = item.id;
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
};
</script>
<style>
	.set_gender{
		height: 100vh;
		background-color: #fff;
		padding: 0 0.12rem 0 0.12rem;
		& i{
			margin-left: 0.16rem;
		}
	}
</style>