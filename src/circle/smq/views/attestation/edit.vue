<template>
	<div class='smq-edit'>
		<y-nav :title="$R('sm-expert-title')"></y-nav>
		<div v-if='headData'>
			<y-card :title="headData.nickName" :type='type' :badge='true' :src='headData.headImg' img-size="large" position="vertical">
				<div slot='assist'>
					<div class='smq-assist'>
						{{$R('application-requirement')}}
						<span v-if='headData.jCount >= 3' class="stauts--on">{{$R('reach')}}</span>
						<span v-else class="stauts--off">{{$R('no-reach')}}</span>
					</div>
				</div>
			</y-card>
			<y-item :title="$R('good-field')" :placeholder="$R('select-good-field')" clickable @click="BarristerClick" v-model='vm.data.goodField'></y-item>
			<div class="submit_button">
				<y-button block @click.native='preview' :disabled='disabled'>{{$R('affirm')}}</y-button>
			</div>
		</div>
	</div>
</template>

<script>
	import { YNav } from '@/components/nav';
	import Button from '@/components/button';
	import YCard from '@/components/card';
	import YItem from '@/components/item'
	import Dialog from '@/components/dialog';
	import Toast from '@/components/toast';
	export default {
		components: {
			YNav,
			YCard,
			YItem,
			[Button.name]: Button
		},
		data() {
			return {
				type: 1,
				headImg: '',
				count: 3,
				headData: '',
				goodField: '',
				disabled: true,
				vm: {
					data: {
						goodField: '',
						createUserId: this.$env.userId,
						moduleEnum: '10134'
					}
				}
			}
		},
		created() {
			// 获取用户基本信息
			this.$http.get('/services/app/v1/digital/authentication/singleInfo/' + this.$env.userId).then(res => {
				this.headData = res.data.data
				console.log(this.headData)
				if (res.data.code === "200") {
					if (this.headData.jCount >= 3) {
						this.disabled = false
					}
				}
			});

			this.eventData();
		},
		methods: {
			eventData() {
				let request = this.$route.params.id === "0" ? null : {
					method: 'GET',
					url: `/services/app/v1/digital/authentication/personalInfo/${this.$env.userId}`
				};
				this.$localStore.getOrSet('petDeta', request, this.vm).then(res => {
					this.vm = res
					console.log('dfhdfhfd', this.vm.data.goodField)
				})
			},
			preview() {
				var postData = {
					...this.vm.data
				}
				var listData = {
					createUserId: this.$env.userId,
					moduleEnum: '10134',
					goodField: this.vm.data.goodField
				}
				console.log(postData);
				if (!postData.goodField) {
					Toast(this.$R('hint-good-field'))
					return;
				} else {
					Dialog.confirm({
						title: this.$R('good-field'),
						message: this.$R('sm-hint')
					}, {
						okText: this.$R('ok'),
						cancelText: this.$R('no')
					}).then(() => {
//						this.$http.post('/services/app/v1/digital/authentication/accretion', postData).then(res => {
//							if (res.data.code === '200') {
//								this.$router.replace({
//									path: '/expert/inspect/' + 0
//								})
//							}
//						})					
						console.log(postData);
						let methods = this.$route.params.id === '0' ? 'post' : 'put';
						let Murl = this.$route.params.id === '0' ? '/services/app/v1/digital/authentication/accretion' : '/services/app/v1/digital/authentication/editorGoodFieldSingle'
						this.$http[methods](Murl, listData).then((res) => {
							let message = this.$route.params.id === '0' ? this.$R('modified-authentication') : this.$R('finish-authentication');
							Toast(message);
							this.$router.replace('/expert/inspect/' + 0);
							this.$localStore.remove('petDeta');
						}).catch(err => {
							Toast(err)
						});							
					}).catch(() => {
						//
					});
					return false;
				}
			},
			BarristerClick() {
				if (this.disabled) {
					return;
				}
				if (this.$route.params.id === "1") {
					Toast('已通过认证不能修改')
					return;
				}
				this.$router.push({
					path: '/expert/field'
				})
			}
		}
	}
</script>

<style>
	.smq-edit {
		& .y_card {
			margin-top: 0.5rem;
		}
		& .smq-assist {
			margin: 0.2rem 0 0.5rem 0;
			font-size: 12px;
			color: #868686;
			line-height: 14px;
			& span {
				border-radius: 7px;
				padding: 0 7px;
				color: #fff;
				font-size: 11px;
				margin-left: 6px;
			}
		}
		& .submit_button {
			margin-top: 1rem;
		}
		& .item--clickable .item-wrap {
			border-top: 0;
		}
	}
	
	.stauts--on {
		background: #1bc25e;
	}
	
	.stauts--off {
		background: #1bc25e;
	}
</style>