<template>
	<div class="activity-list-item">
		<!-- <y-card :data="data"></y-card> -->
		<router-link :to="`activity/details/${data.id}`">
			<div class="activity-title">
				<span class="iconfont icon-set-top" v-if="data.stickFlag === 1"></span>
				<span v-html="activityTitle"></span>
			</div>
			<div class="activity-time" v-text="activityTime"></div>
			<div class="activity-addr" v-if="data.address" v-text="activityAddress"></div>

			<div class="activity-img">
				<img :src="data.activityImg | imageResize(3)" class="activity-fm-img">
				<!-- <state-label :status="data.activityStatus"></state-label> -->
			</div>
		</router-link>
		<div class="activity-item-foot">
			<y-item>
				<span slot="head" v-if="data.custCount" class="activity-member" v-text="activityMember"></span>
				<div slot="foot" class="labels">
					<span class="label" :style="{'background-color': bgColor}" v-text="label"></span>
					<div class="iconfont icon-more more-menu" :id="menuTriggerId" @click.stop v-if="showMenu"></div>
				</div>
			</y-item>
		</div>
		<y-menu static :menu="menu" :options="menuOptions" class="action_menu" v-if="showMenu"></y-menu>
	</div>
</template>

<script type="text/javascript">
import YCard from '@/components/card';
import YItem from '@/components/item';
import Menu from '@/components/menu';
import moment from 'moment';
import actiontMixin from '../../mixins/action-methods'
export default {
	name: 'userItem',
	mixins: [
		actiontMixin
	],
	components: {
		YCard,
		YItem,
		[Menu.name]: Menu
	},
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			replaceData: (this.$route.query.keyword || '').replace(/\\/g, '').replace(/\//g, ''),
			label: '',
			bgColor: '',
			permission: this.$coterie.permission,
			currentTime: new Date().getTime()
		}
	},
	computed: {
		isUnderCoterie() {
			return this.$route.params.coterieId;
		},
		showMenu() {
			return this.permission === 100 && this.isUnderCoterie && this.data.resourceType === '1005' && this.currentTime < this.data.signupEndDate;
		},
		activityTitle() {
			if (this.replaceData) {
				let reg = RegExp(this.replaceData, 'g');
				return this.data.activityTitle.replace(reg, `<span class='search-color'>${this.replaceData}</span>`)
			} else {
				return this.data.activityTitle
			}

		},
		activityMember() {
			return this.data.activityStatus === 3 
				? this.$R('participants-numb-o', this.data.custCount)
				: this.$R('participants-numb', this.data.custCount);
		},
		activityTime() {
			let start = moment(this.data.signupStartDate).format('YYYY-MM-DD HH:mm');
			let end = moment(this.data.signupEndDate).format('YYYY-MM-DD HH:mm');
			return `${this.$R('activity-time')}：${start} ${this.$R('to')} ${end} `;
		},
		activityAddress() {
			return `${this.$R('activity-address')}：${this.data.address.replace(/,/g, '')}`;
		},
		menu() {
			let menu = [
				{
					text: '置顶',
					action: () => this.handleStick(this.data)
				},
				{
					text: '取消置顶',
					action: () => this.handleUnstick(this.data)
				}
			];
			let newMenu = [];
			if (this.data.stickFlag === 0) {
				newMenu.push(menu[0])
			} else {
				newMenu.push(menu[1])
			}
			return newMenu
		},
		menuTriggerId() {
			return `menu-trigger-activity-${this.data.id}`
		},
		menuOptions() {
			return {
				trigger: `#${this.menuTriggerId}`,
				transparentMask: false
			}
		}
	},
	mounted() {
		if (this.data.activityStatus) {
			switch (this.data.activityStatus) {
				case 1:
					this.label = this.$R('signup');
					this.bgColor = 'rgba(1,133,255,.4)';
					break;
				case 2:
					this.label = this.$R('ongoing');
					this.bgColor = '#F2C117';
					break;
				case 3:
					this.label = this.$R('ended');
					this.bgColor = '#999';
					break;
			}
		} else {
			if (this.currentTime < this.data.signupStartDate) {
				this.label = this.$R('signup');
				this.bgColor = 'rgba(1,133,255,.4)';
			} else if (this.currentTime > this.data.signupStartDate && this.currentTime < this.data.signupEndDate) {
				this.label = this.$R('ongoing');
				this.bgColor = '#F2C117';
			} else {
				this.label = this.$R('ended');
				this.bgColor = '#999';
			}
		}
	}
};
</script>

<style>
@import "#/css/var.css";

.activity-list-item {
	@apply --border-bottom;
	position: relative;
	padding: .3rem;
	background: #fff;
	& .iconfont {
		font-size: .34rem;
	}
	& .more-menu {
		background: none;
		color: var(--text-assist-color);
		padding: 0;
		margin-left: .2rem;
	}
	& .icon-set-top {
		color: #fb4545;
		margin-right: 2px;
	}
	& .activity-title {
		@apply --text-cut-multi-line;
		-webkit-line-clamp: 2;
		color: var(--text-primary-color);
		font-size: .38rem;
		font-weight: 600;
	}
	& .activity-time {
		margin-top: .2rem;
		color: var(--text-secondary-color);
	}
	& .activity-addr {
		color: var(--text-secondary-color);
	}

	& .activity-img {
		position: relative;
		margin: .3rem 0;
		border-radius: .12rem;
		overflow: hidden;
		& .activity-fm-img {
			display: block;
			width: 100%;
			height: 3.1rem;
		}
	}

	& .activity-item-foot {
		& .activity-member {
			color: var(--text-tips-color);
			font-size: .3rem;
		}
		& .item {
			padding: 0;
			min-height: auto;
			& .item-wrap {
				padding: 0;
			}
		}
		& .labels {
			display: flex;
			align-items: center;
		}
		& .label {
			padding: 0 .2rem;
			border-radius: 4px;
			color: #FFF;
			background-color: #D6D6D6;
		}
		& .actionmore-menu {
			margin-left: .2rem;
		}
	}
	&:last-child {
		border-bottom: 0;
	}
}
</style>