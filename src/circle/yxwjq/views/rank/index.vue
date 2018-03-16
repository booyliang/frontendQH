<template>
	<div class="rank">
		<y-nav title="排行榜" :transparent="true"></y-nav>
		<div class="rank-header" @click="toRankCurrentUser">
			<div class="user-rank-data">
				<dl>
					<dt>获赞数</dt>
					<dd>{{ requestData[tabId].userData.likeCount | count }}</dd>
				</dl>
			</div>
			<y-card :src="userData.userImg" position="vertical" img-size="large" :title="userData.nickName"></y-card>
			<div class="user-rank-data">
				<dl>
					<dt>当前排名</dt>
					<dd v-if="requestData[tabId].userData.likeCount > 0">{{ requestData[tabId].userData.rank }}</dd>
					<dd v-else>暂无排名</dd>
				</dl>
			</div>
		</div>
		<div class="rank-body">
			<div class="rank_tab-bar"><y-tab-bar v-model="tabId" :tabOption="menuData"></y-tab-bar></div>
			
			<div class="list-header">
				<span class="number">排名</span>
				<span class="avatar">头像</span>
				<span class="nickname">昵称</span>
				<span class="like-count">获赞数</span>
			</div>
           
			<y-load-more @can-load="loadMore" v-for="key in Object.keys(requestData)"  :class="[requestData[key].listClassName]" :key="key" :state="requestData[key].state" v-show="tabId === key" :offset="50">
				<y-list class="flow_list">
					<y-rank-item :rank="index+1" :item-data="item" :key="index" v-for="(item, index) in requestData[key].listData"></y-rank-item>
				</y-list>
			</y-load-more>
			
		</div>
	</div>
</template>
<script>
	let request = {
		pageNo: 1,
		pageSize: 10,
		state: 'prepared',
		listData: [],
		userData: {
			rank: 0,
			likeCount: 0
		}
	}
	import YNav from '@/components/nav/nav'
	import YCard from '@/components/card'
	import YTabBar from '@/components/tab'
	import YLoadMore from '@/components/load-more'
	import YList from '@/components/list'
	import YRankItem from '../../components/rank-item'
	export default {
		components: {
			YNav,
			YCard,
			YTabBar,
			YLoadMore,
			YRankItem,
			YList
		},
		filters: {
			'count': function (value) {
				if (parseInt(value) > 9999) {
					return (value / 10000).toFixed(2) + '万'
				} else {
					return value;
				}
			}
		},
		data() {
			return {
				item: YRankItem,
				tabId: 'day',
				menuData: [{id: 'day', text: '日榜'}, {id: 'week', text: '周榜'}, {id: 'all', text: '总榜'}],
				userData: {
					nickName: '测试用户'
				},
				requestData: {
					'day': {
						...request,
						listClassName: 'day-rank-list',
					},
					'week': {
						...request,
						listClassName: 'week-rank-list',
					},
					'all': {
						...request,
						listClassName: 'all-rank-list'
					},
				}
			}
		},
		watch: {
			tabId(newVal) {
				let currentList = this.requestData[newVal]
				if (currentList.state !== 'end' && currentList.listData.length === 0) {
					this.getListData();
				}
			}
		},
		methods: {
			getListData() {
				let requestData = this.requestData[this.tabId];
				requestData.state = 'loading';
				this.$http.get(`/services/app/v1/ranking/list/${requestData.pageNo}/${requestData.pageSize}?type=${this.tabId}`).then(response => {
					let resData = response.data;
					if (resData.code === '200') {
						resData = resData.data;
						let userData = resData.currentUser || { ...request.userData };
						this.userData = userData;
						requestData.userData = userData;
						if (requestData.listData.length === 0) {
							requestData.listData = resData.entities
						} else {
							resData.entities.forEach(item => {
								requestData.listData.push(item);
							})
						}
						let state = resData.entities.length < requestData.pageSize ? 'end' : 'prepared';
						requestData.state = state;
					} else {
						this.$toast(resData.msg);
					}
				}).catch(error => {
					this.$toast('接口请求出错，请联系管理员');
					requestData.state = 'end';
				})
			},
			loadMore() {
				this.requestData[this.tabId].pageNo++;
				this.getListData();
			},
			scrollToUser(data) {
				let selector = `.${data.listClassName} .list .rank-item`;
				let rankItems = document.querySelectorAll(selector);
				let userItem = rankItems[data.userData.rank - 1];
				window.scrollTo(0, userItem.offsetTop - (document.documentElement.clientHeight / 2));
				// window.scrollTo(0, 100);
			},
			toRankCurrentUser() {
				let currentData = this.requestData[this.tabId];
				if (!currentData.userData.likeCount) {
					return false;
				}
				if (currentData.userData.rank > currentData.listData.length) {
					this.$http.get(`/services/app/v1/ranking/listbyUser/${currentData.pageNo}/${currentData.pageSize}?type=${this.tabId}`).then(response => {
						let resData = response.data;
						if (resData.code === '200') {
							resData = resData.data;
							currentData.pageNo = resData.currentPage;
							resData.entities.forEach(item => {
								currentData.listData.push(item);
							});
							this.$nextTick(() => {
								this.scrollToUser(currentData);
							})
						} else {
							this.$toast(resData.msg);
						}
					})
				} else {
					this.scrollToUser(currentData);
				}
			}
		},
		mounted() {
			this.getListData();
		}
	}
</script>
<style>
 @import "#/css/var.css";
	.rank {
		& .rank-header {
			display: flex;
			justify-content: space-around;
			padding: 1.3rem 0.3rem 0;
			margin-top: -1.28rem;
			height: 3.54rem;
			background: url('../../assets/user_top_bg@2x.png') no-repeat center center;
			background-size: cover;

            & .y_card--vertical .y_avatar {
            	margin-bottom: .2rem;
            } 
			& .y_card-text h4 {
				color: #fff;
			}
			& .y_card-title {
                color: #fff;
                font-size: 16px;
			}
			& .user-rank-data {
				display: flex;
				align-items: center;
				margin-top: 0.3rem;
				width: 1.29rem;
				height: 0.88rem;
				color: #fff;
				background: url('../../assets/ranking-bg@2x.png') no-repeat center center;
				background-size: cover;

				& dl {
					width: 100%;
					text-align: center;
					line-height: 1.4;
					& dt {
						font-size: 13px;

					}
					& dd {
						font-size: 12px;
					}
					& dt, & dd {
						text-shadow: 0 0 1px #fff,
									0 0 2px #0400a4,
									0 0 3px #0400a4;
					}
				}
			}
		}
		& .rank-body {
			background: #fff;

			& .rank_tab-bar {
				padding: .3rem 0;
				background: #fff;
				position: static;
				position: sticky;
				top: 1.26rem;
				left: 0;
				right: 0;
				z-index: 2;
			}
			& .tab_bar {
				height: 0.6rem;
				line-height: .6rem;
				margin: 0 0.5rem 0;
				border-radius: .3rem;
				background: #f8f8f8;
				overflow: hidden;
                & a {
                    border: none; 
                	margin: 0;
					&:first-child {
						padding: 0;
						margin-left: 0;
					}
					&:last-child {
                        padding: 0;
                        margin-right: 0;
					}
				}
			}
			& .tab_bar-item {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 2.1rem;
				height: .6rem;
				line-height: .6rem;
				margin: 0;
				padding: 0;
				color: var(--text-secondary-color);
				font-size: 18px;
				text-align: center;
				&.active {
					color: #fff;
					border: none;
					border-radius: .3rem;
					width: 2.1rem;
				    height: .6rem;
					background: url('../../assets/bg-tabbar@2x.png') no-repeat center center;
			    	background-size: cover;
			    	/* 安卓手机不兼容 选中状态不显示 */
					/*&:before {    
						content: '';
						position: absolute;
						width: 100%;
						height: 100%;
						left: 0;
						top: 0;
						background: red;
						z-index: -1;
						border-radius: .3rem;
						background: linear-gradient(-157deg, #4359d8, #4db8fc);
					}*/
				}
			}

			& .list-header {
				padding: .2rem 0;
				border-top: .02rem solid #f4f4f4;
				font-size: 13px;
				color: var(--text-assist-color);
                @apply --display-flex;
                justify-content: space-around;

			    & span {
			        display: inline-block;

					&.number {
		              width: .75rem;
		              text-align: right;
					}
					&.avatar {
					  width: .9rem;
					  text-align: right;
					}
					&.nickname {
					  width: 3rem;
					  text-align: left;
					}
					&.like-count {
					   width: 1.2rem;
					}
			    }
			}
		}
	}
</style>
