<template>
	<div class="edit">
		<!-- 导航 S-->
		<y-nav title="私圈基本信息">
		</y-nav>

		<!-- 私圈信息 -->
		<div>
			<y-list>
				<y-item v-if="permission === 100" title="私圈图片">
					<img slot='foot' :src="coterieData.icon" alt=" " @click="changePhoto">
				</y-item>
				<y-item v-if="permission !== 100" title="私圈图片">
					<img slot='foot' :src="coterieData.icon" alt=" " @click="showPhoto">
				</y-item>
				<y-item v-if="permission === 100" title="私圈名字" :value="coterieData.name" to="name">
				</y-item>
				<y-item v-if="permission !== 100" title="私圈名字" :value="coterieData.name">
				</y-item>
				<y-item title="私圈名片" to="quickMark">
					<div slot='foot' class="iconfont icon-two-code"></div>
				</y-item>
				<y-item class="intro" title="私圈简介" :value="coterieData.intro" to="introduction">
				</y-item>
				<y-item title="私圈所有成员" :value="coterieData.memberNum + '/' +coterieData.maxMemberNum" to="member">
				</y-item>
			</y-list>
			<div class="coterie-set " v-if="permission===100 ">
				<y-item title="加入私圈方式 " :value="joinway " to="additionway">
				</y-item>
				<y-item title="成员收费方式 " :value="cosultway" to="consultway">
				</y-item>
				<y-item title="成员入圈审核 ">
					<span v-if="switchShow" slot="foot">
						<y-switch v-model="on" :disabled="switchDisabled" @click.native="joinCheck"></y-switch>
					</span>
				</y-item>
			</div>
			<div v-if="permission === 200" class="coterie-quit" @click="quitCoterie ">退出私圈</div>
		</div>
	</div>
</template>
<script>
import Switch from '@/components/switch'
import YList from '@/components/list'
import Toast from '@/components/toast'
import Dialog from '@/components/dialog'
import Album from '@/components/album'
export default {
	components: {
		[Switch.name]: Switch, YList, Toast
	},
	name: 'coterie',
	data() {
		return {
			on: false,
			coterieData: {},
			permission: Number,
			switchShow: false,
		}
	},
	computed: {
		joinway() {
			if (this.coterieData.joinFee === 0) {
				return "免费"

			} else {
				return this.coterieData.joinFee / 100 + "悠然币/永久"
			}
		},
		cosultway() {
			if (this.coterieData.consultingFee  === 0) {
				return "免费"
			} else {
				return this.coterieData.consultingFee / 100 + "悠然币/次"
			}
		},
		switchDisabled() {
			if (this.coterieData.joinFee === 0) {
				return false

			} else {
				return true;
			}
		},

		devType() {  // 机型
			let devType = this.$env.devType;
			if (devType === 0) {
				return 'Andriod';
			} else if (devType === 1) {
				return 'iOS ';
			} else {
				return 'PC';
			}
		}

	},
	created() {
		this.$nextTick(() => {
			this.permission = this.$coterie.permission;
			this.coterieData = this.$coterie;
			this.switchShow = true;
			if (this.coterieData.joinFee > 0) {
				this.on = false;
				return;
			}
			if (this.coterieData.joinCheck === 1) {
				this.on = true;
			}
		})






	},
	methods: {
		showPhoto() {
			Album.init([this.coterieData.icon]);
			Album.show();
		},
		changePhoto() {
			this.$yryz.uploadPics({ picNum: 1 })
				.then(data => {
					this.coterieData.icon = data.picUrls[0];
					let parms = {
						icon: this.coterieData.icon,
					}
					this.$http.put(`/services/app/v1/coterie/info/single/${this.$coterie.coterieId}`, parms).then(res => {
						if (res.data.code === '200') {
							this.$coterie.icon = this.coterieData.icon;
							Toast("修改成功！")
						} else {
							Toast(res.data.msg)
						}

					})
				})


		},
		joinCheck() {
			console.log("switch")
			let parms = {
				joinCheck: this.on ? 1 : 0
			}
			this.$http.put(`/services/app/v1/coterie/info/single/${this.$coterie.coterieId}`, parms).then(res => {
				if (res.data.code === '200') {
					this.$coterie.joinCheck = this.on ? 1 : 0;
				}
			})

		},
		quitCoterie() {
			Dialog.confirm({
				message: '退出私圈后将不再接收并查看私圈的任何内容，确定退出私圈？',
			},
				{
					okText: this.$R('confirm'),
					cancleText: this.$R('cancel')
				}).then(() => {
					this.$http.put(`/services/app/v1/coterie/member/quit`).then(res => {
						if (res.data.code === '200') {
							this.$coterie.permission = 300;
							this.$coterie.memberNum = this.$coterie.memberNum - 1;
							// 埋点						
							window.zhuge.track('退出私圈', {
								'用户id': this.$env.custId, // 用户id
								'机型': this.devType, // 设备类型 Andriod ios
								'圈子名称': this.$circle.circleName, // 圈子名称
							},
								function () {
									// console.log('track succeed')	
								});

							this.$router.back();
						} else {
							Toast(res.data.msg)
						}
					})
				}).catch(() => {
					return false;
				})

		}
	}
}	
</script>
<style>
@import '#/css/var.css';

.edit {
	& img {
		width: 1.6rem;
		height: 1.6rem;
		border-radius: .1rem;
	}
	& img.quickmark {
		width: 0.4rem;
		height: 0.4rem;
		border-radius: 0;
	}
	& .list {
		/* @apply --border-bottom; */
		& .icon-two-code {
			color: var(--text-assist-color);
		}
	}

	& .item-value {
		color: var(--text-assist-color);
	}

	& .coterie-set {
		margin-top: 0.2rem;
		/* @apply --border-top; */
	}
	& .icon-arrow-right:before {
		margin-left: 0.16rem;
	}
	& .intro {
		& .item-foot {
			& .item-value {
				@apply --text-cut-multi-line;
				-webkit-line-clamp: 1;
				text-overflow: ellipsis;
				padding-left: 1.5rem;
			}
		}
	}
	& .coterie-quit {
		background: #fff;
		margin-top: 0.2rem;
		line-height: 3.5;
		text-align: center;
		font-size: .34rem;
	}
}
</style>

    