<template>
	<div class="address-edit">
		<y-list class="form-list">
			<y-item title="收货人姓名">
				<y-input slot="body" v-model="vm.consignee" :show-text-length-info="false" :maxlength="20" placeholder="输入收货人真实姓名"></y-input>
			</y-item>
			<y-item title="收货人电话">
				<y-input slot="body" v-model="vm.phone" placeholder="输入电话号码" :show-text-length-info="false" :maxlength="11"></y-input>
			</y-item>
			<y-item title="收货人地址" vertical class="location-textarea">
				<y-input type="textarea" slot="body" v-model="vm.location" :maxlength="50" placeholder="输入详细地址"></y-input>
			</y-item>
		</y-list>
		<div class="save-button">
			<y-button v-if="!$route.params.id" @click.native="onSaveAddress" block>保存收货信息</y-button>
			<template v-else>
				<y-button @click.native="onSaveAddress">保存收货信息</y-button>
				<y-button type="error" @click.native="onDeleteAddress">删除收货信息</y-button>
			</template>
		</div>
	</div>
</template>
<script>
	import YList from '@/components/list'
	import YItem from '@/components/item'
	import YInput from '@/components/input'
	import Validator from '@/utils/validator'
	let validator;
	export default {
		components: {
			YList,
			YItem,
			YInput
		},
		data() {
			return {
				id: '',
				vm: {
					consignee: '',
					location: '',
					phone: '',
					createUserId: this.$env.userId
				},
				previewOrder: {},
			}
		},
		methods: {
			onSaveAddress() {
				validator.validate([
					{ name: 'consignee', value: this.vm.consignee },
					{ name: 'phone', value: this.vm.phone },
					{ name: 'location', value: this.vm.location }
				]).then(() => {
					let method = this.id ? 'put' : 'post';
					this.$http[method]('/services/app/v1/addr/single', this.vm).then(response => {
						let resData = response.data;
						if (this.vm.id === this.previewOrder.address.id) {
							this.previewOrder.address = {
								id: this.vm.id,
								receivingAddress: this.vm.location,
								receivingName: this.vm.consignee,
								receivingPhone: this.vm.phone
							}
						}
						if (resData.code === '200') {
							this.$router.back();
						} else {
							this.$toast(resData.msg);
						}
					})
				}).catch(() => {})
			},
			onDeleteAddress() {
				this.$dialog.confirm('确认删除此地址 ？').then(() => {
					this.$http.delete(`/services/app/v1/addr/single/${this.vm.id}`).then(response => {
						if (this.vm.id === this.previewOrder.address.id) {
							this.previewOrder.address = {};
						}
						let resData = response.data;
						if (resData.code === '200') {
							this.$router.back();
						} else {
							this.$toast(resData.msg);
						}
					}).catch(error => {
						this.$toast('可能出了一点小问题');
						console.log(error);
					})
				}).catch(() => {})
			}
		},
		created() {
			this.previewOrder = this.$localStore.get('previewOrder');
			validator = new Validator({
				phone: [
					{ rule: 'required', message: '请填写收货人电话'},
					'mobile',
				],
				consignee: [
					{ rule: 'required', message: '请填写收货人姓名'},
				],
				location: [
					{ rule: 'required', message: '请填写收货人地址'},
				]

			})
			let id = this.$route.params.id;
			this.id = id;
			if (id) {
				this.$http.get(`/services/app/v1/addr/single/${id}`).then(response => {
					let resData  = response.data;
					if (resData.code === '200') {
						this.vm = resData.data;
					} else {
						this.$toast(resData.msg);
					}
				})
			}
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.address-edit {
		min-height: calc(100vh - 1.28rem);
		background: #fff;
		& .item {
			padding: 0;
		}
		& .form-list {
			& input {
				text-align: right;
				font-size: 15px;
			}
			& .item:last-child {
				& .item-wrap {
					border-bottom: 1px solid var(--border-color);
				}
			}
		}
		& .item-wrap {
			padding: .3rem .26rem;
			& input::placeholder {
				color: #666;
			}
		}
		& .location-textarea {
			& .item-head {
				align-self: flex-start;
			}
			& .y-textarea {
				flex-direction: row;
				& textarea {
					min-height: 0;
					height: 55px;
					font-size: 15px;
				}
			}
			& .text-length-info {
				margin-left: 1em;
				align-self: flex-start;
				font-size: 13px;
			}
		}
		& .save-button {
			display: flex;
			justify-content: center;
			padding-top: 1rem;
			& button ~ button {
				margin-left: .3rem;
			}
		}
	}
</style>
