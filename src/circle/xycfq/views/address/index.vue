<template>
	<div class="address-index">
		<y-check-item @click.native="onSelectAddress($event, item)" v-for="item in listData" :key="item.id" :data="item" type="checkbox">
			<template>
				<div class="address-content">
					<dl>
						<dt>收货人姓名:</dt>
						<dd>{{ item.consignee }}</dd>
					</dl>
					<dl>
						<dt>收货人电话:</dt>
						<dd>{{ item.phone }}</dd>
					</dl>
					<dl>
						<dt>收货人地址:</dt>
						<dd>{{ item.location }}</dd>
					</dl>
				</div>
				<div class="action">
					<router-link :to="{name: 'address-edit', params: {id: item.id}}">编辑</router-link>
				</div>
			</template>
		</y-check-item>

		<div class="save-button">
			<y-button to="/address/new" :disabled="listData.length >= 5" block>新增收货信息</y-button>
		</div>
	</div>
</template>
<script>
	import YButton from '@/components/button'
	import YCheckGroup from '@/components/check-group'
	import YCheckItem from '@/components/check-group/check-item'
	export default {
		components: {
			YButton,
			YCheckGroup,
			YCheckItem
		},
		data() {
			return {
				listData: [],
				listParams: {
					page: 1,
					pageSize: 10
				},
				previewOrder: {}
			}
		},
		methods: {
			loadData() {
				this.$http.get(`/services/app/v1/addr/list/${this.listParams.page}/${this.listParams.pageSize}`).then(response => {
					let resData = response.data;
					if (resData.code === '200') {
						resData = resData.data;
						resData.entities.forEach(item => {
							item.checked = item.id === this.previewOrder.address.id;
						});
						this.listData = resData.entities;						
					} else {
						this.$toast(resData.msg);
					}
				}).catch(error => {
					console.log(error);
				})
			},
			onSelectAddress(e, itemData) {
				if (itemData.checked || e.target.localName === 'a') return false;
				this.previewOrder.address = {
					id: itemData.id,
					receivingAddress: itemData.location,
					receivingName: itemData.consignee,
					receivingPhone: itemData.phone 
				}
				this.listData.forEach(item => {
					item.checked = item.id === itemData.id;
				});
				this.$router.back();
			}
		},
		mounted() {
			this.previewOrder = this.$localStore.get('previewOrder');
			this.loadData();
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.address-index {
		min-height: calc(100vh - 1.28rem);
		background: #fff;
		& .check_item {
			padding: .3rem;
			& .iconfont {
				align-self: flex-start;
			}
			& .check_item-content {
				display: flex;
				& .address-content {
					flex: 1;
					width: 4.5rem;
					display: flex;
					flex-direction: column;
					padding-right: .3rem;
					line-height: 1;
					& dl {
						margin: 0 0 .25rem;
						padding: 0;
						display: flex;
						line-height: 1.5;
						&:last-child {
							margin-bottom: 0;
						}
						& dt {
							flex: 0 0 auto;
						}
						& dd {
							padding-left: 0.2rem;
						}
					}
				}
				& .action {
					flex: 0 0 auto;
					text-align: right;
					line-height: 1;
					& a {
						color: var(--theme-color);
						font-size: 14px;
					}
				}
			}
		}
		& .save-button {
			padding-top: 1rem;
		}
	}

	
</style>
