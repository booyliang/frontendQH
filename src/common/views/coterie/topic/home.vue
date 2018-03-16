<template>
	<div class="topic_home">
		<y-nav :title="$R('topic-home')">
			<y-button @click.native.stop="onAction" slot="nav-right" type="text" class="iconfont icon-more" v-if="permission !== 300"></y-button>
		</y-nav>
		<div class="topic_home-img">
			<img :src="topicData.imgUrl" v-if="topicData.imgUrl"/>
		</div>
		<div class="topic-info topic-info-invitation">
			<div class="topic-info-title" v-if="topicData.title">
				<span class="iconfont icon-topic"></span><span class="fontbold">#{{topicData.title}}#</span>
			</div>
			<div class="topic-info-content" v-text="topicData.content"></div>
			<div class="topic-info-footer">
				<span class="nickName" v-text="topicData.nickName" @click="goPersonInfo(topicData.createUserId)"></span>
				<span class="time">{{ topicData.createDate | recentTime }}</span>
			</div>
		</div>
		<y-flow-list :request="flowRequest" :item="invitationItem"></y-flow-list>
		<div class="button_bottem_wrap">
			<div class="button_bottem">
				<div class="topic-join" @click.stop="goJoin">
					<span type="text" :disabled="true" >{{$R('topic-join')}}</span>
				</div>
				<div class="join-coterie" :class="{shut: isShut}" @click.stop="goHomepage" v-if="permission === 300">
					<div>
						<span @click.stop="handleShut" class="iconfont icon-close-o"></span>
						加入私圈可以了解更多
					</div>
				</div>	
			</div>
		</div>
	</div>
</template>
<script>
import actiontMixin from '../mixins/action-methods';
import {YNav, YNavToggle} from '@/components/nav'
import YFlowList from '@/components/flow-list'
import InvitationItem from './components/invitation-item'
export default {
	name: 'coterie-topic-home',
	mixins: [
		actiontMixin
	],
	components: {
		YNav,
		YNavToggle,
		YFlowList
	},
	data() {
		return {
			permission: this.$coterie.permission,
			topicData: {},
			invitationItem: InvitationItem,
			flowRequest: {
				url: '/services/app/v1/post/list',
				params: {
					topicId: this.$route.params.topicId,
					orderBy: 'time'
				}
			},
			isShut: false
		}
	},
	created() {
		console.log('用户身份', this.permission)
		this.$http.get('/services/app/v1/topic/single/' + this.$route.params.topicId).then(res => {
			if (res.data.code === "200") {
				this.topicData = res.data.data
			}
		})
	},
	computed: {
		menuData() {
			let menu = [
				{ text: '删除', handler: () => this.handleDelete(this.$route.params.topicId, '/services/app/v1/coterie/topic/delete/', 'detail') },
				{ text: '举报', handler: () => this.handleReport(this.$route.params.topicId) }
			]
			let newMenu = [];
			if (this.permission === 100) {
				newMenu.push(menu[0])
			} else {
				newMenu.push(menu[1])
			}
			return newMenu
		}
	},
	methods: {
		onAction() {
			this.$actionsheet(this.menuData);
		},
		async goJoin() {
			await this.$user.login();
			let res = await this.$http.get('/services/app/v1/coterie/user/checkPlatformShutup');
			if (res.data.code === '200') {
				this.$router.push('/coterie/' + this.$route.params.coterieId + '/topic/join/' + this.$route.params.topicId)
			} else if (res.data.code === '1023' || res.data.code === '1024') {
				this.$toast('您已被禁言！')
			} else {
				this.$toast(res.data.msg)
			}
		},
		goPersonInfo(userId) {
			this.$yryz.toPersonalInfo({ userId: userId });
		},
		goHomepage() {
			this.$router.push({
				path: `/coterie/${this.$route.params.coterieId}`
			})
		},
		handleShut() {
			this.isShut = true
		}
	}
}	
</script>
<style type="text/css">
	@import "#/css/var.css";
	.topic_home {
		& .load_more {
         /* @apply --border-top;*/
		}

		& .topic_home-img {
			& img {
				width: 100%;
				height: 3.36rem;
				display: block;
			}
		}
		& .button_bottem_wrap {
			padding-top: 1.5rem;
			& .button_bottem {
				position: fixed;
				bottom: 0;
				left: 0;
				width: 100%;
				& .topic-join {
					
					    height: 1.06rem;
					    background: #f4f4f4;
					    padding: 0.18rem 0.3rem;
				    & span {
				    	display: block;
				    	width: 100%;
					    height: 0.7rem;
					    line-height: 0.7rem;
					    border-radius: 0.1rem;
					    background: #fff;
					    color: #bfbfbf;
					    font-size: .32rem;
					    padding: 0 0.2rem;
					    color: var(--text-tips-color);
				    }
				}
				& .join-coterie {
					width: 100%;
					padding: 0.12rem 0;
					background: #80c2ff;
					& div {
						position: relative;
						text-align: center;
						color: #fff;
					    font-size: .26rem;
					    line-height: 1;
					    & span {
					    	position: absolute;
					    	right: 0.3rem;
					    	font-size: .26rem;
					    }
					}
				}
			}	
			& .shut {
				display: none;
			}
		} 

		& .topic-info {
          padding: .4rem .3rem;
		}
		& .image--responsive {
			& img {
				border-radius: .12rem;
			}
		}
		& .flow_item-video {
			border-radius: .12rem;
		}
		& .fontbold {
           font-weight: bold;
		}
	}
</style>