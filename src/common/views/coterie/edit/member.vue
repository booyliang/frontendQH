<template>
	<div class="edit-member">
		<!-- 导航 S-->
		<y-nav title="全部成员">
			<div v-if="permission === 100" slot="nav-right">
				<span class="edit-member-button" @click="gotoApplyList">{{applyMember}}</span>
			</div>
		</y-nav>
		<!-- 列表 S-->
		<y-load-more-remote :request="request" @loaded="handleLoaded">
			<y-list>
				<y-item v-for="(item, index) of data" :key="index">
					<y-card @click-img="handleClickImg(item.userId)" @click-name= "handleClickImg(item.custId)" :title="item.nickName" :src="item.headImg" :class="[item.permission === 100? 'master':'' ,item.banSpeak === 1 && ( permission ===100 ||item.userId===userId ) ? 'mute':'']" :badge="item.custCert === 1" :type="2" img-size="large" position="horizontal">
						<div slot="assist">
							<p v-if="item.permission === 200">{{item.createDate | moment('YYYY-MM-DD')}}加入</p>
						</div>
					</y-card>
					<div v-if="permission === 100">
						<y-button type="text" v-if="item.permission === 100">圈主</y-button>
						<y-button class="iconfont icon-more" type="text" v-if="item.permission === 200" @click.native="openAction(item)"></y-button>
					</div>
					<div v-if="permission !== 100">
						<y-button type="text" v-if="item.permission === 100">圈主</y-button>
						<y-button class="btn-pay" type="text" v-if="item.addCoterieType === 0 && item.userId === userId">免费</y-button>
						<y-button class="btn-pay" type="text" v-if="item.addCoterieType === 1 && item.userId === userId">付费{{item.addCoterieMoney | priceUnit}}悠然币</y-button>
					</div>
				</y-item>
			</y-list>
		</y-load-more-remote>

		<y-modal ref="modal">
			<div class="modal-container">
				<div class="modal-body">
					<y-input type="textarea" :maxlength='30' placeholder="填写踢出理由，踢出后该用户将接受不到圈内任何消息" v-model="applyReason"></y-input>
				</div>
				<div class="modal-footer">
					<div type="text" @click="handleOk" class="modal-button">确定</div>
					<div type="text" @click="handleCancle" class="modal-button">取消</div>
				</div>
			</div>
		</y-modal>
	</div>
</template>
<script>
import LoadMoreRemote from '@/components/load-more-remote';
import YCard from '@/components/card'
import YList from '@/components/list'
import YItem from '@/components/item'
import YInput from '@/components/input'
import YButton from '@/components/button'
import YModal from '@/components/modal'
export default {
	components: {
		YCard, YList, YItem, YModal, YButton, [LoadMoreRemote.name]: LoadMoreRemote, YInput
	},
	name: 'coterie',
	data() {
		return {
			currItem: null,
			coterieData: {},
			permission: Number,
			applyReason: '',
			data: [],
			userId: '',
			request: {
				methods: 'get',
				url: `/services/app/v1/coterie/member/list`,   // ${this.$route.params.coterid}`,
				params: {
					pageNo: '1',
					pageSize: '20'
				}
			}
		}
	},
	computed: {
		applyMember() {
			if (!this.coterieData.newMemberNum) {
				return "待通过 (0)"
			}
			if (this.coterieData.newMemberNum <= 99) {
				return "待通过 ( " + this.coterieData.newMemberNum + " )"
			} else {
				return "待通过 ( 99+ )"
			}
		}
	},
	created() {
		this.permission = this.$coterie.permission;

		this.$http.get(`/services/app/v1/coterie/info/single/${this.$route.params.coterieId}`).then(res => {
			this.coterieData = res.data.data;
		});
		this.userId = this.$env.custId;
	},
	methods: {
		handleLoaded(dataList, res) {

			this.data.push(...dataList);

		},
		gotoApplyList() {
			this.$router.push('applyList')
		},
		openAction(item) {
			this.currItem = item;
			if (item.addCoterieType === 0) {
				this.$actionsheet([
					{
						text: '踢出',
						handler: () => {
							this.openModal(item)
						}
					},
					{
						text: item.banSpeak === 1 ? "取消禁言" : "禁言",
						handler: () => {
							let url = item.banSpeak === 1 ? "/services/app/v1/coterie/member/unBanSpeak" : "/services/app/v1/coterie/member/banSpeak"
							this.$http.put(`${url}/${item.userId}`).then(res => {
								if (res.data.code === '200') {
									item.banSpeak = item.banSpeak === 0 ? 1 : 0;
								} else {
									this.$toast(res.data.msg)
								}
							})
						}
					}
				]);
			} else {
				this.$actionsheet([
					{
						text: item.banSpeak === 1 ? "取消禁言" : "禁言",
						handler: () => {
							let url = item.banSpeak === 1 ? "/services/app/v1/coterie/member/unBanSpeak" : "/services/app/v1/coterie/member/banSpeak"
							this.$http.put(`${url}/${item.userId}`).then(res => {
								if (res.data.code === '200') {
									item.banSpeak = item.banSpeak === 0 ? 1 : 0;
								} else {
									this.$toast(res.data.msg)
								}
							})
						}
					}
				]);
			}

		},
		openModal(item) {
			this.$refs['modal'].open();

		},
		handleOk() {
			let item = this.currItem;
			this.$refs['modal'].close();
			if (!item) {
				return;
			}
			else if (!this.applyReason) {
				this.$toast("踢出理由不能为空！")
			} else {
				let parms = {
					"memberId": item.userId,
					"kickReason": this.applyReason
				}
				this.$http.put("/services/app/v1/coterie/member/kick", parms).then(res => {
					if (res.data.code === '200') {
						this.$coterie.memberNum = this.$coterie.memberNum - 1;
						this.$utils.refresh();
					} else {
						this.$toast(res.data.msg)
					}
				})
			}
			this.applyReason = ''
		},
		handleCancle() {
			this.$refs['modal'].close();
		},
		handleClickImg(userId) {
			this.$yryz.toPersonalInfo({ userId: userId });
		}

	}
}
</script>
<style>
@import "#/css/var.css";
.edit-member {
	background: #fff;
	& .list {
		& .item .item-wrap {
			@apply --border-bottom;
			border-top: none;
		}
		& .item {
			padding: 0 0.3rem;
			&:last-child > .item-wrap{
				border-bottom: 0;
			}
		}
		& .item-wrap {
			padding: 0.3rem 0;
		}
	}
	& .load_more-tip {
		background: var(--bg-color);
	}
	& .y-input-wrap.y-textarea textarea {
		min-height: 1.2rem;
	}
	& .y_avatar-badge {
		border: 1px solid #fff;
	}
	& .edit-member-button {
		color: #fff;
		font-size: .3rem;
		background: #80c2ff;
		padding: 0.1rem 0.15rem;
		border-radius: 0.15rem;
	}
	& .y-input-wrap {
		width: 6rem;
		height: 1.8rem;
		border: 1px solid #eee;
		border-radius: 0.15rem;
	}
	& .modal-container {
		width: 6rem;
		& .modal-body {
			margin: var(--layout-space);
			& .y-input-wrap {
				@apply --border;
				border-radius: .1rem;
				width: 5.3rem;
			}
		}
		& .modal-footer {
			background-color: var(--bg-color);
			height: 1rem;
			display: flex;
			text-align: center;
			line-height: 1rem;
			& .modal-button {
				flex: 1;
				&:first-child {
					position: relative;
					&::after {
						content: '';
						position: absolute;
						right: 0;
						top: .2rem;
						bottom: .2rem;
						border-right: 1px solid var(--border-color);
					}
				}
			}
		}
	}
	& .y_card {
		& .y_avatar.y_card-img__large {
			width: .9rem;
			height: .9rem;
			min-width: .9rem;
			min-height: .9rem;
			flex: 0 0 .9rem;
			margin-right: .16rem;
		}
	}
	& .y_card-title {
		font-size: .34rem;
		color: var(--text-primary-color);
	}

	& .y_card-text {
		& p {
			font-size: .24rem;
			color: var(--text-assist-color);
			margin-top: 0.1rem;
		}
	}

	& .button {
		color: var(--text-assist-color);
		padding-right: 0;
	}
}



.y_card.master {
	position: relative;
	&:before {
		content: '';
		display: inline-block;
		width: 0.4rem;
		height: 0.4rem;
		position: absolute;
		top: -0.2rem;
		left: -0.1rem;
		background-image: url(/assets/static/crown.png);
		background-size: cover;
	}
}

.y_card.mute {
	position: relative;
	&:before {
		content: '';
		display: inline-block;
		width: 0.36rem;
		height: 0.36rem;
		position: absolute;
		background: #fff url(/assets/static/mute.png);
		background-size: cover;
		background-position: 50%;
		bottom: 0;
		left: 0.1rem;
		border-radius: 50%;
		border: 1px solid red;
		z-index: 10;
	}
}

.button.button--text.btn-pay {
	color: #58a2ff;
}
</style>