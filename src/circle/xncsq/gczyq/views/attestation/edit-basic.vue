<template>
	<div id="" class="basic-info">
		<y-nav :title="$R('perfect-information')"></y-nav>
		<y-list>
			<y-item>
				<y-input v-model="vm.data.realPhone" type='Number' :maxlength="11" :show-text-length-info="false" :placeholder="$R('real-phone-number')"></y-input>
			</y-item>
			<y-item>
				<y-input v-model="vm.data.realName" :maxlength="10" :show-text-length-info="false" :placeholder="$R('RealName')"></y-input>
			</y-item>
			<y-item>
				<y-input v-model="vm.data.idCode" :maxlength="18" :show-text-length-info="false" :placeholder="$R('RealID')"></y-input>
			</y-item>
		</y-list>
		<y-button block @click.native="onClick" class="jkys-attestation-button">{{$R('next')}}</y-button>
	</div>
</template>

<script>
import { YNav } from '@/components/nav';
import List from '@/components/list';
import Item from '@/components/item';
import Button from '@/components/button';
import YInput from '@/components/input';
import Toast from '@/components/toast';

export default {
	components: {
		YNav,
		[List.name]: List,
		[Item.name]: Item,
		[Button.name]: Button,
		YInput
	},
	data() {
		return {
			vm: {
				data: {
					certificationMaterialsImg: '',
					faceAndIdImg: '',
					idCode: '',
					idImg: '',
					nickName: '',
					occupation: '',
					organization: '',
					realName: '',
					realPhone: '',
					speciality: '',
					workCity: '',
					moduleEnum: '10021',
					id: ''
				}
			}
		}
	},
	methods: {
		initData() {
			// console.log(typeof this.$route.params.id);
			// console.log(this.$circle.userId + "||" + this.$env.userId);
			// 这里通过路由将上个页面是否认证状态传过来
			let request = this.$route.params.id === "1" ? {
				method: 'GET',
				url: '/services/app/v1/doctorAuthentication/getInfoByUserId/' + this.$circle.userId
			} : null
			this.$localStore.getOrSet('petDeta', request, this.vm)
				.then(res => {
					this.vm = res;
					console.log(this.vm);
				})
		},
		onClick() {
			if (this.vm.data.realPhone === '' || !/^1[3|4|5|7|8|9]\d{9}$/.test(this.vm.data.realPhone)) {
				Toast(this.$R('toast-correct-phone'));
				return false;
			}
			if (this.vm.data.realName === '' || !/^[\u4e00-\u9fa5]+$/gi.test(this.vm.data.realName)) {
				Toast(this.$R('standard-name'));
				return false;
			}
			if (this.vm.data.idCode === '') {
				Toast(this.$R('standard-id-null'));
				return false;
			} else if (!/^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i.test(this.vm.data.idCode)) {
				Toast(this.$R('standard-id'));
				return false;
			}
			this.$router.replace(`/shoot/perfect/${this.$route.params.id}`)
		}
	},
	created() {
		this.initData();
	}
}
</script>

<style>
.basic-info {
	& .list {
		margin-top: 0.3rem;
		& input {
			width: 100%;
			font-size: 14px;
		}
	}
	& .input-bottom-txt {
		display: none;
	}
}
</style>