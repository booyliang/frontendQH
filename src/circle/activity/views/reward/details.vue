<template>
	<div class="reward_detail" :class="{'rewardShared': !this.$yryz.isNative()}">
		<y-nav title="悬赏详情">
			<span slot="nav-right" @click="openActionsheet" class="iconfont icon-more"></span>
		</y-nav>

		<div class="flow_detail"  v-if="detailData" >
			<y-reward-item-detail :data="detailData"></y-reward-item-detail>

			<y-panel title="悬赏回答" icon="answer" class="reward_detail_panel">
				<y-reward-answer-list v-bind="{detailData}"></y-reward-answer-list>
			</y-panel>
		</div>
		
		
		
	</div>
</template>
<script>
import YRewardItenDetail from './components/reward-item-detail'
import Panel from '@/components/panel';
import YRewardAnswerList from './components/reward-answer-list'
import Action from '@/components/comment/action'
import shareInfo from '@/views/coterie/mixins/shareInfo';
export default {
	mixins: [
		shareInfo
	],
	components: {
		[YRewardItenDetail.name]: YRewardItenDetail,
		[Panel.name]: Panel,
		[YRewardAnswerList.name]: YRewardAnswerList,
	},
	data() {
		return {
			detailData: null
		}
	},
	
	mounted() {
		this.$circle.circleName = "悬赏详情"
		// 详情页 悬赏内容
		let params = {
			custId: this.$env.custId || "",
			offerId: this.$route.params.id,
				
		}
		this.$openApi.get(`/api/v3/offer/detail`,  { params }).then(res => {
			let resData = res.data;
			if (resData.ret === 1) {
				this.detailData = resData.data;

				// 由于分享时以下字段在详情接口都没有，但又不能传空，经与服务端协商要求加了以下字段
				this.detailData.moduleEnum = '0210';
				this.detailData.createUserId = this.detailData.custId;
				// this.detailData.title = '1';
				// this.detailData.resourceId = '1';
				// this.detailData.coterieId = '0';
				this.detailData.isReward = true;
				this.detailData.id = this.detailData.offerId;

				this.$nextTick(() => { // 悬赏二次分享小卡片定制样式
					this.shareInfo({
						title: '圈子有了，一切都有了！',
						desc: this.detailData.content,
						imgUrl: this.detailData.imgUrl.split(',')[0].toString()
					});
				})
			} else {
				this.$toast(resData.msg);
			}
		}).catch(error => {
			this.$toast('接口请求出错，请联系管理员');

		})
	},
	methods: {
		openActionsheet() { 
			this.$actionsheet([
				{
					text: '举报',
					handler: async () => {
						await this.$user.login();
						await this.$yryz.report({
							type: '2',
							sourceId: this.$route.params.id
						})
					}
				},
				{
					text: '分享',
					handler: () => {
						Action["share"].call(this, this.detailData);
						
					}
				},
			]);
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.reward_detail{
	
	& .flow_detail{
		padding: 0;
		background: #f8f8f8;
		& .reward_item_detail {
			/* border-bottom: 1px solid #ecedef; */
		}
		& .reward_detail_panel {
            /* border-top: 1px solid #ecedef; */

		}
		& .panel-title .iconfont{
			font-size: .4rem;
			color: #7fc2ff;
		}
		& .panel--rich {
            padding: 0;
            & .item-wrap {
            	padding: .3rem 0;
            	margin-left: .15rem;
            	margin-right: .15rem;
            }
		}
		& .panel-head {
           padding-left: .3rem;
           padding-right: .3rem;
		}
		& .panel-body .list{
			margin: 0 -0.15rem;
		}
	}
}
.yryz-download {

	& .reward_detail.rewardShared{
		& #navigator{
			display: none;
		}
		& #navigator + div.pdTop{
			padding-top: .28rem;
		}
		& .down-btn{
			display: block;
		}
	}
	& .reward_detail.rewardShared + div{
		& .nav{
			display: none;
		}
		
	}

		
}

</style>
