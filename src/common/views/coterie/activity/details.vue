<template>
	<div class="coterie-activity-details-wrap">
		<!--头部导航 S-->
		<y-nav :title="$R('activity-home')" :showLeftArrow="inApp ? true: false">
			<!-- 分享 -->
			<span v-if="permission === 100 && inApp" slot="nav-right">
				<y-button v-if="isShare" type="text" @click.native="share">{{$R('menu-share')}}</y-button>
			</span>
			<span v-else-if="permission !== 100 && inApp" slot="nav-right">
				<y-button type="text" class="iconfont icon-more" @click.native.stop="onAction"></y-button>
			</span>
		</y-nav>
		<!--头部导航 E-->

		<template v-if="activityData">
			<!--活动主页头部-->
			<div class="activity-head-area">
				<div class="activity-cover">
					<img :src="activityData.activityImg | imageResize(5)">
					<!--活动未开始 或 活动进行中-->
					<div class="activity-date">
						<div class="activity-count-down" v-if="activityData.activityStatus === 1">
							<span class="head-icon">
								<span class="iconfont icon-clock"></span>
								<span v-text="showTipText"></span>
							</span>
							<y-count-down v-if="showCount" :endDate="this.activityData.signupStartDate" :nowDate="activityData.currentTime" @countdown_end="countdownEnd"></y-count-down>
						</div>
						<!--活动进行中 活动已结束-->
						<div class="activity-ended" v-else>
							<span class="iconfont icon-clock" v-if="activityData.activityStatus === 2"></span>
							<span v-text="showEndText"></span>
						</div>
					</div>
				</div>
				<!-- 标题 -->
				<div class="activity-title" v-text="activityData.activityTitle"></div>
			</div>

			<y-list>
				<!-- 活动时间 -->
				<y-item vertical>
					<div slot="head">
						<span class="iconfont icon-clock-circle"></span>
						<span v-text="$R('activity-time')" class="icon-title"></span>
					</div>
					<div slot="foot" class="activity-time" v-text="activityTime"></div>
				</y-item>
				<!-- 活动地址 -->
				<y-item v-if="activityData.address" vertical>
					<div slot="head">
						<span class="iconfont icon-addr-a-b"></span>
						<span v-text="$R('activity-address')" class="icon-title"></span>
					</div>
					<div slot="foot" class="activity-address-nav">
						<div class="activity-address" v-text="activityAddress" :style="navStyle"></div>
						<div class="activity-nav" @click="openMap" v-if="permission">
							<div class="iconfont icon-arrow"></div>
							<div class="nav-text">{{$R('navigation')}}</div>
						</div>
					</div>
				</y-item>
				<!-- 活动详情 -->
				<y-fold-item :title="$R('activity-detail')" :content="activityData.activityContent" icon="icon-article"></y-fold-item>
				<!-- 活动成员 -->
				<y-item :value="memberText" to="participants" append clickable v-if="inApp">
					<div slot="head">
						<span class="iconfont icon-user-a"></span>
						<span v-text="$R('signup-info')" class="icon-title"></span>
					</div>
				</y-item>
			</y-list>

			<!-- 参与活动 button -->
			<div class="activity-buttton" v-if="inApp && (showDel || showJoin)">
				<y-button v-if="showDel" block @click.native="delet">{{$R('delet-activity')}}</y-button>
				<y-button v-if="showJoin" block :disabled="activityData.joinActivity === 1 || activityData.custCount >= activityData.signupTotalCount" @click.native="signup">{{signupButtonText}}</y-button>
			</div>
		</template>
	</div>
</template>

<script>
import { YNav, YNavSearch, YNavToggle } from '@/components/nav';
import actiontMixin from '../mixins/action-methods';
import Actionsheet from '@/components/actionsheet';
import CountDowm from './components/count-down';
import FoldItem from './components/fold-item';
import YButton from '@/components/button';
import YList from '@/components/list';
import YItem from '@/components/item';
import Action from '@/components/comment/action';
import mapNav from '@/components/map-nav';
import Toast from '@/components/toast';
import Dialog from '@/components/dialog';
import moment from 'moment';

export default {
	components: {
		YNav, YNavToggle, YNavSearch, Toast, YButton, YList, YItem,
		[CountDowm.name]: CountDowm,
		[FoldItem.name]: FoldItem,
	},
	mixins: [actiontMixin],
	data() {
		return {
			inApp: this.$yryz.isNative(),
			menuData: [{ text: '举报', handler: () => this.handleReport(this.$route.params.activityId) }],
			shareData: null,
			activityData: null,
			showCount: true,
			permission: null,    // 圈主身份
		}
	},
	computed: {
		isShare() {
			return this.activityData && this.activityData.allowShareFlag === 1;
		},
		activityTime() {
			let index = this.activityData.signupStartDate.lastIndexOf(':');
			let start = this.activityData.signupStartDate.slice(0, index).replace(/-/g, '.');
			let end = this.activityData.signupEndDate.slice(0, index).replace(/-/g, '.');
			return `${start} ${this.$R('to')} ${end}`;
		},

		memberText() {
			return `${this.activityData.custCount}/${this.activityData.signupTotalCount}`
		},
		showTipText() {
			// if (this.permission === 100) return this.$R('activity-end-time');
			return this.activityData.joinActivity === 1 ? this.$R('activity-end-time') : this.$R('activity-start-time');
		},

		showEndText() {
			return this.activityData.activityStatus === 2
				? this.$R('ongoing')
				: this.$R('activity') + this.$R('ended');
		},
		activityAddress() {
			return this.activityData.address.replace(/,/g, '');
		},
		navStyle() {
			return this.inApp
				? { 'padding-right': '.4rem' }
				: { 'padding-right': '0' }
		},
		signupButtonText() {
			if (this.activityData.custCount >= this.activityData.signupTotalCount) return '报名人数已满';
			return this.activityData.joinActivity === 1 ? this.$R('have-signup') : this.$R('want-signup')
		},
		showDel() {
			return this.permission === 100 && !this.activityData.custCount;
		},
		showJoin() {
			return this.permission !== 100 && this.activityData.activityStatus === 1;
		}
	},

	created() {
		this.permission = this.$coterie.permission // 获取权限信息
		// console.log(this.permission);

		// 活动详情接口
		this.$http.get(`/services/app/v1/coterie/activity/single/${this.$route.params.activityId}`).then(res => {
			let _data = res.data;
			if (_data.code !== '200') return false;
			this.activityData = Object.assign({}, _data.data);

			this.shareData = {
				imgUrl: this.activityData.activityImg,
				title: this.activityData.activityTitle,
				content: this.activityData.contentSource,
				id: this.activityData.id,
				moduleEnum: this.activityData.moduleEnum
			}
			if (this.isShare && this.activityData.activityStatus !== 3) {
				this.menuData.push({
					text: this.$R('menu-share'),
					handler: this.share
				});
			}
		});
	},

	methods: {
		onAction() {
			this.$actionsheet(this.menuData);
		},
		share() {
			Action["share"].call(this, this.shareData);
		},
		beforeDestroy() {
			mapNav.hide();
		},

		// 参与活动
		async signup() {
			await this.$user.login();
			// 活动状态 下架处理
			let _data = await this.$http.get(`/services/app/v1/coterie/activity/selectShelveFlag/${this.activityData.id}`);
			if (_data.data.code !== '200') return false;
			let shelveFlag = _data.data.data.shelveFlag;
			let activityStatus = _data.data.data.activityStatus;
			if (shelveFlag === '1' || activityStatus !== '1') {
				this.$utils.refresh();
				return false;
			}
			this.$router.push({ path: `${this.$route.params.activityId}/signup` });
		},
		delet() {
			Dialog.confirm('删除此次活动？').then(() => {
				this.$http.put(`/services/app/v1/coterie/activity/shelve/${this.activityData.id}`).then(res => {
					if (res.data.code === '200') {
						this.$router.back();
					} else if (res.data.code === '1000') {
						Toast('当前活动状态已更新，无法取消当前活动').then(() => {
							this.$utils.refresh();
						});
					}
				})
			}).catch(() => console.log('cancel'));
		},

		// 倒计时结束
		countdownEnd() {
			this.showCount = false;
			this.activityData.activityStatus = 2;
		},

		openMap() {
			if (!this.activityData.address) {
				console.error('address cannot null!');
				return false;
			}
			let addr = this.activityData.address.split(',');
			let param = null;
			if (addr.length === 3) {
				param = {
					province: addr[0],
					city: addr[1],
					address: addr[2],
					lat: this.activityData.latitude,
					lng: this.activityData.accuracy,
				}
			} else {
				param = {
					province: addr[0],
					city: addr[0],
					address: addr[1],
					lat: this.activityData.latitude,
					lng: this.activityData.accuracy,
				}
			}
			mapNav.init(param)
		}
	}
}
</script>

<style lang="css">
@import "#/css/var.css";
.coterie-activity-details-wrap {
	min-height: 100vh;
	background: #fff;

	& .activity-head-area {
		background: white;
		line-height: 1;
		color: var(--text-primary-color);
		padding-bottom: .2rem;
		background: #f8f8f8;
		& .activity-cover {
			position: relative;
			&>img {
				display: block;
			}
			& .activity-date {
				position: absolute;
				bottom: 0;
				width: 100%;
				color: #fff;
				background: var(--bg-alpha-color);
				padding: .2rem;
				& .activity-count-down {
					display: flex;
					justify-content: space-between;
					font-size: var(--default-font-size);
					line-height: .4rem;
					& .head-icon {
						& .iconfont {
							font-size: .34rem;
						}
					}
				}
				& .activity-ended {
					text-align: center;
					& .iconfont {
						font-size: .34rem;
					}
				}
			}
		}
		& .activity-title {
			padding: .3rem;
			font-size: .38rem;
			font-weight: bold;
			line-height: 1.5;
			background: #fff;
		}
	}

	& .list {
		padding-bottom: 1.2rem;
		/* flex: 1; */
		background-color: #FFF;

		& .item-head {
			& .iconfont {
				color: #a6d4ff;
			}
			& .icon-title {
				font-size: .28rem;
				color: var(--text-assist-color);
			}
		}
		& .item-foot {
			font-size: .32rem;
			line-height: 20px;
		}
		& .activity-address-nav {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;

			& .activity-nav {
				display: block;
				min-width: 1.4rem;
				padding-left: .2rem;
				border-left: 1px solid var(--border-color);
				text-align: center;

				& .iconfont {
					color: #185FFF;
				}

				& .nav-text {
					font-size: .28rem;
					color: var(--text-assist-color);
				}
			}
		}

		& .item-value {
			margin-right: .2rem;
			font-size: .28rem;
		}
	}

	& .activity-buttton {
		@apply --border-top;
		background: #FFF;
		padding: .2rem 0;
		position: fixed;
		width: 100%;
		left: 0;
		bottom: 0;
	}

	& .mask {
		z-index: 21;
	}
}
</style>
