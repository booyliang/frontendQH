<template>
	<div class="coterie-participants-wrap">
		<!--头部导航 S-->
		<y-nav :title="title"> </y-nav>
		<!--头部导航 E-->
		<y-load-more-remote :request="request" @loaded="handleLoaded" :endTip="false">
			<div class="card-list">
				<y-item v-for="(item, index) of data" :key="index" :class="item.userId === $env.userId ? 'curr-user' : ''" @click="toPersonalInfo(item.userId)">
					<y-card :title="item.nickName" :src="item.headImg" img-size="large" slot="head" @click-img="toPersonalInfo(item.userId)" @click-name="toPersonalInfo(item.userId)"></y-card>
					<div slot="foot" v-text="getPhone(item.signupUserPhone)" class="phone"></div>
				</y-item>
			</div>
		</y-load-more-remote>
		<y-message :icon="icon" title="目前还没有人参与"></y-message>
	</div>
</template>

<script>
import YMessage from '@/components/message'
import LoadMoreRemote from '@/components/load-more-remote';
import Nav from '@/components/nav/nav';
import YButton from '@/components/button';
import YCard from '@/components/card';
import YItem from '@/components/item';
import icon from '@/assets/no-people@2x.png';

export default {
	components: {
		YButton, YItem, YCard, YMessage,
		[LoadMoreRemote.name]: LoadMoreRemote,
		[Nav.name]: Nav,
	},

	data() {
		return {
			data: [],
			request: {
				url: `/services/app/v1/coterie/activity/signList/${this.$route.params.activityId}`,
				params: {
					pageSize: 20
				}
			},
			icon,
		}
	},
	computed: {
		title() {
			return `${this.$R('participants')}${this.data.length ? '(' + this.data.length + ')' : ''}`;
		}
	},
	methods: {
		handleLoaded(dataList, res) {
			this.data.push(...dataList);
		},

		getPhone(phone) {
			return this.$coterie.permission === 100 ? phone : phone.slice(0, 3) + '****' + phone.slice(-4);
		},
		toPersonalInfo(custId) {
			this.$yryz.toPersonalInfo({
				userId: custId
			})
		},
	}
}
</script>

<style>
@import "#/css/var.css";

.coterie-participants-wrap {
	min-height: 100vh;
	background: #fff;

	& .card-list {
		background: #fff;
		& .y_card-title {
			color: var(--text-secondary-color);
		}
		& .phone {
			color: var(--text-secondary-color);
		}

		& .curr-user {
			& .y_card-title,
			& .phone {
				color: #0185ff;
			}
		}
	}

	& .message {
		display: none;
	}
	& .empty~.message {
		display: block;
	}
}
</style>
