<template>
	<div class="member">
		<y-nav :title="$R('member-square')">
			<span slot="nav-right">
				<y-button type="text" to="/search" class="iconfont icon-search-c"></y-button>
			</span>
		</y-nav>
		<y-panel class="member_new-container" :title="$R('member-new-member')" colorful :more="viewAll">
			<div class="scroll_h">
				<y-item v-for="(item, index) in memberData"
						:key="index">
						<y-card :title="item.nickName"
								:src="item.userImg"
								position="vertical" :to="`/user/${item.userId}`"></y-card>

				</y-item>
			</div>
		</y-panel>
		<div class="team-content">
			<y-tab-bar v-model="tabId" :tabOption="tabData"></y-tab-bar>
			<div class="team-container">
				<div class="creatCircle"
						 v-if = "tabId === 'all'"
						 :class="{ 'noCircle': showStatus }"
						 @click="createTeam">
						<i class="iconfont icon-plus-a"></i>
						<label>{{$R('member-create')}}</label>
					</div>
				<div v-if="showStatus">
					<div class="noCircleBg noTeam" v-if = "tabId === 'all'">
						<y-message :icon = "noContentImg"></y-message>
						<p>{{$R('member-nogroup')}}</p>
						<p>{{$R('member-create-group')}}</p>
					</div>
					<div v-if="tabId === 'mine'" class="noCircleBg noMyTeam">
						<y-message :icon = "noContentImg"></y-message>
						<p>{{$R('member-join-group')}}</p>
					</div>
				</div>
				<div v-show="showStatus === false">
					<y-load-more-remote :request="request" @loaded="onCanLoad">
						<y-list>
							<y-item v-for="(item, index) in teamData"
									:key="index"
									@click.native="goChat(item)">
								<div class="y_card">
									<div class="y_avatar y_card-img__large" position="horizontal" imgsize="large">
										<img alt="" :src="item.icon || defaultImg" class="y_avatar-img y_avatar-default">
										<span class="tips" v-text="$R('member-joint')" v-if="item.joinFlag === 1"></span>
									</div>
									<div class="y_card-text">
										<h4 class="y_card-title" v-text="item.tname"></h4>
									</div>
								</div>
							</y-item>
						</y-list>
					</y-load-more-remote>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import List from '@/components/list';
import Item from '@/components/item';
import YCardUser from '@/components/card-user';
import Ycard from '@/components/card';
import Button from '@/components/button';
import YTabBar from '@/components/tab';
import LoadMoreRemote from '@/components/load-more-remote';
import YNavSearch from '@/components/nav/nav-search';
import { YNav } from '@/components/nav';
import Panel from '@/components/panel';
import Toast from '@/components/toast';
import Message from '@/components/message';
export default {
	components: {
		[List.name]: List,
		[Item.name]: Item,
		'y-card': Ycard,
		[Button.name]: Button,
		[YTabBar.name]: YTabBar,
		[LoadMoreRemote.name]: LoadMoreRemote,
		[Message.name]: Message,
		'y-nav': YNav,
		YNavSearch,
		[Panel.name]: Panel
	},
	data() {
		return {
			viewAll: '',
			defaultImg: '/assets/static/member-default-img@2x.png',
			noContentImg: '/assets/static/no-content@2x.png',
			tabId: this.$route.params.tabId || 'all',
			tabData: [{id: 'all', text: this.$R('member-all-group')}, {id: 'mine', text: this.$R('member-my-group')} ],
			memberData: [],
			teamData: []
		}
	},
	created() {
		let newItems = [];
		// 获取最新成员
		this.$http.get('/services/app/v1/member/list/1/10').then(response => {
			this.viewAll = response.data.data.count > 10 ? '/member/list' : '';
			response.data.data.entities.forEach(item => {
				newItems.push(item);
			});
			this.memberData.push(...newItems);
		}).catch(error => {
			console.log(JSON.stringify((error)));
		});
	},
	methods: {
		onCanLoad(list) {
			this.teamData.push(...list);
		},
		createTeam() {
			this.$yryz.createCircleTeam({ circleKey: this.$circle.appId, circleName: this.$circle.circleName })
			.then(data => {
				// if (!!data.teamId) {
				// 	this.clickTabItem();
				// }
			});
		},
		goChat(item) {
			if (item.joinFlag !== 1) {
				this.$yryz.joinTeam({ teamId: item.tid, verifyType: item.joinmode })
					.then(data => {
						if (data.status === 1) {
							Toast(this.$R('member-join-success'));
							item.joinFlag = 1;
						} else if (data.status === 2) {
							Toast(this.$R('member-send-success'));
						} else {
							Toast(this.$R('member-send-error'));
						}
					});
			} else {
				this.$yryz.sessionTeam({ teamId: item.tid });
			}
		},
	},
	computed: {
		request() {
			this.teamData = [];
			let url = this.tabId === 'all' ? '/services/app/v1/member/im/list' : '/services/app/v1/member/im/mylist'
			return {
				url
			}
		},
		showStatus() {
			return !this.teamData.length;
		}

	}
}
</script>
<style>
@import '#/css/var.css';
.member_new-container {
	border-top: .2rem solid #f8f8f8;
    
	& .panel-head {
		border-bottom: 0;
	}

	& .panel-body {
		padding: 0 .25rem;
		& .scroll_h {
			width: 100%;
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			overflow-x: scroll;
			& .item{
				min-width: 1.52rem;
				-webkit-box-flex: 0;
				-ms-flex: 0 0 auto;
				flex: 0 0 auto;
			}
			& .item-wrap {
				border-top: 0;
				padding: 0 0 .3rem;
				& > a {
					width: 1.12rem;
					overflow: hidden;
				}
				& .y_avatar {
					flex-basis: auto;
					width: .9rem;
					height: .9rem;
					margin-bottom: .2rem;
				}
				& .y_card-text {
					text-align: center;
					line-height: 1;
					width: 100%;
					& .y_card-title {
						max-width: 5em;
						@apply --text-cut;
						font-size: .28rem;
						color: var(--text-primary-color);

					}
				}

			}
		}
	}
}
.member {
	background-color: #fff;
    height: 100vh;
	& .team-content{
		border-top: .2rem solid #f8f8f8;
		& .team-container{
			background-color: transparent;

			& .y_card-img__large {
			   & .y_avatar-img {
			  	 border-radius: 0;
			  }
			}
		}
		& .item-wrap{
			position: relative;
			& .tips{
				position: absolute;
				background-color: rgba(0, 0, 0, .3);
				left: 0;
				right: 0;
				bottom: 0;
				width: 100%;
				color: #fff;
				text-align: center;
				border-radius: 0 0 .1rem .1rem;
				z-index: 2;
			}
		}
		& .y_avatar{
			background-color: #ddd;
			border-radius: .1rem;
			overflow: hidden;
		}
		& .y_card-title{
			color: var(--text-secondary-color);
			font-size: .34rem;
		}
	}
}
.creatCircle {
		padding: 0.3rem;
		background: #fff;
		color: var(--theme-color);
		overflow: hidden;
		@apply --display-flex;
		justify-content: flex-start;
		& label {
			font-size: .34rem;
		}
		& i { 
			font-size: .44rem;
			margin-right: .3rem; 
			width: 1.2rem;
			height: 1.2rem;
			border: .02rem solid var(--theme-color);
			@apply --display-flex;
		    justify-content: center;
		    border-radius: .1rem;
		}
	}

.creatCircle.noCircle {
	display: block;
	height: .8rem;
	width: 3.65rem;
	border: .01rem solid var(--theme-color);
	padding: 0;
	margin: 1rem auto;
	border-radius: .1rem;
	color: var(--theme-color);
	background: none;
	@apply --display-flex;
	justify-content: center;
	& i {
		font-size: .44rem;
		margin-right: .4rem;
		border: none;
		width: auto;
		height: auto;
	}
}
.noCircleBg {
	width: 100%;
	text-align: center;
	font-size: .32rem;
	color: var(--text-tips-color);
	&.noTeam {
		& .message{
			padding: 0;
		}
	}
	&.noMyTeam {
		& .message{
			padding-bottom: 0;
		}
	}
	& img {
		display: block;
		width: 2.46rem;
		border: none;
		margin: 1rem auto .6rem;
		background: none!important;
	}
}

</style>