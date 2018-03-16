<template>
	<div class="xyzx-index">
		<div class="cover">
		</div>

		<div class="xyzx-content">
			<div class="products_entry">
				<y-button to="/product/goods-view" type="ghost">查看全部赊销商品</y-button>
			</div>
			<y-text-card title="信用助学" hide-button class="intro" @more="showIntroContent">
				“信用助学”计划系由融众资本投资集团有限公司发起，武汉海稻经济发展有限公司主办，武汉海稻国际生物科技有限公司、武汉悠然一指网络有限公司、武汉融众网络技术有限公司提供支持。本计划旨在践行“大众创业，万众创新”，倡导诚信，用信用取得创业助学的机会。凡在校大学生均可申请参与本计划，并通过本计划实现创业梦想！
			</y-text-card>
			<y-check type="checkbox" :disabled="agreeDisabeld" name="agreement" v-model="agreeRules">我已阅读并同意<a href="javascript:;" class="j-agreement-trigger" @click="showRulesContent">《信用助学申请须知》</a></y-check>

			<div class="approve-status">
				<template v-if="statusData.flowStatus !== undefined">
					<y-button block v-if="statusData.flowType && parseInt(statusData.flowType) !== 2" :disabled="true">{{ errorTips[statusData.flowType - 1] }}</y-button>
					<y-button block v-else @click.native="clickButton" :disabled="buttonData.disabled">{{ buttonData.text }}</y-button>
				</template>
				<y-button v-else block @click.native="clickButton">{{ buttonListData[1].text }}</y-button>
			</div>
		</div>

		<!-- <y-modal ref="introContent">
			<div class="rules-wrap">
				<h4 class="text_card-title">
					<i class="title-line"></i>
					信用助学介绍
					<b class="title-line"></b>
				</h4>
				<div class="rules-content">
					<p>
						“信用助学”计划系由融众资本投资集团有限公司发起，武汉海稻经济发展有限公司主办，武汉海稻国际生物科技有限公司、武汉悠然一指网络有限公司、武汉融众网络技术有限公司提供支持。本计划旨在践行“大众创业，万众创新”，倡导诚信，用信用取得创业助学的机会。凡在校大学生均可申请参与本计划，并通过本计划实现创业梦想！
					</p>
				</div>
				<div class="action">
					<y-button block @click.native="hideIntro">关闭</y-button>
				</div>
			</div>
		</y-modal> -->

		<y-modal ref="rulesContent">
			<div class="rules-wrap">
				<h4 class="text_card-title">
					<i class="title-line"></i>
					须知详情
					<b class="title-line"></b>
				</h4>
				<div class="rules-content">
					<p>为保障申请参加“信用助学”者的合法权益，请您详细阅读下述规则，避免因发生错误、误解给您带来的损失。</p>
					<p>一、申请人必须为在校大学生且需年满18周岁；</p>
					<p>二、具有完全民事行为能力；</p>
					<p>三、申请人须授权平台对其个人征信进行查询。一经授权，该授权不可撤销。</p>
					<p>四、商家根据对申请人的征信审核情况，给予累计不超过一万元产品的信用赊销额度。申请人在不违反规定且不存在逾期支付赊销货款的情况下，可在经批准的信用赊销额度内循环使用。若申请人出现逾期等违约违规行为，该循环额度暂停使用。申请人可在给予的产品信用赊销额度内选择相应金额的产品。 </p>
					<p>五、申请人只能选择赊销商品库内产品并享受代理商价格，但须按合同约定的市场统一零售价格销售。</p>
					<p>六、申请人可选择3个月或6个月两种方式之一支付信用赊销货款。每月须支付一次固定金额。申请人可提前支付产品信用赊销货款。</p>
					<p>七、申请人须一次性支付100元服务费，该服务费系申请人办理信用赊销过程中所产生的平台通道费、征信查询费及相关服务的成本及费用开支，一旦支付不予退还。申请人循环使用信用赊销额度期间不重复收取该服务费。</p>
					<p>八、如遇商家产品货源紧张，申请人同意按顺序等待商家安排发货。</p>
					<p>九、对每个申请人，商家仅免费向一个收货地址发货一次。如申请人需要分地、分次发货，请与商家客服联系，但运费须由申请人承担。</p>
					<p>十、申请人如有违约、违规行为，商家有权单方取消申请人的产品信用赊销额度。</p>
					<h5>风险提示：</h5>
					<p>1、网上所显示的产品图片仅为展示之用，最终以实物为准。</p>
					<p>2、申请人所购买的产品和信用赊销的产品为食品，商家一旦发货后均不予以退、换货。</p>
					<p>3、凡因承运人引起的各种损失与责任，申请人应及时向承运人索赔。商家不承担法律责任。</p>
					<p>4、请申请人务必详细阅读须知，特别是有关费用支付的内容。一旦申请人参加“信用助学”活动，即视为申请人对本须知内容予以认可。除此外，申请人还应详细阅读《产品信用赊销合同》所载全部条款，并严格履行。</p>
					<p>5、申请人如有任何不明之处，请与商家线上客服人员咨询4000777260。</p>
					<p>客服：QQ：1161961919，微信：xycf1919，邮箱：1161961919@qq.com</p>
					<h4>本人对上述须知已认真阅读并已充分理解。</h4>
				</div>
				<div class="action">
					<y-button block @click.native="hideRules">关闭</y-button>
				</div>
			</div>
		</y-modal>
	</div>
</template>
<script>
	import YModal from '@/components/modal'
	import YPanel from '@/components/panel'
	import YCheckGroup from '@/components/check-group'
	import YCheck from '@/components/check'
	import YTextCard from '../../components/text-card'
	import YProductItem from '../../components/product-item'
	import flowStatusMixin from '../../mixins/flow-status.js'
	export default {
		mixins: [flowStatusMixin],
		components: {
			YModal,
			YPanel,
			YCheckGroup,
			YCheck,
			YTextCard,
			YProductItem
		},
		data() {
			return {
				agreeRules: true,
				agreeDisabeld: false,
				statusData: {flowStatus: undefined},
				productList: [],
				// 当前类型与流程类型不符时提示文字
				errorTips: ['已参加信用助学计划', '已参加信用赊销计划', '已参加信用借贷'],
				buttonListData: {
					1: { text: '我要申请', link: '/xyzx/apply'},
					2: { text: '已提交申请，等待审核中', link: '', disabled: true},
					3: { text: '审核不通过', link: '', disabled: true},
					4: { text: '资料上传有误，去修改资料', link: '/user/profile'},
					5: { text: '申请通过，请选择赊销商品', link: { name: 'product-list', params: {userType: 1} }},
					6: { text: '赊销服务费未支付，去支付', link: '/user/order'},
					7: { text: '申请通过，请选择赊销商品', link: { name: 'product-list', params: {userType: 1} }},
					8: { text: '继续选择赊销商品', link: { name: 'product-list', params: {userType: 1} }},
					9: { text: '继续选择赊销商品', link: { name: 'product-list', params: {userType: 1} }},
					10: {
						0: { text: '您有逾期款未还完', link: '/user/repayment-list'},
						1: { text: '您的赊销额度被冻结，请联系客服', link: '', disabled: true},
					},
					11: { text: '我要申请', link: '/xyzx/apply'},
					30: { text: '我要申请', link: '/xyzx/apply'}
				}
			}
		},
		watch: {
			'statusData.flowStatus': function (newVal) {
				if (parseInt(newVal) !== 1) {
					this.agreeRules = true;
					this.agreeDisabeld = true;
				}
			}
		},
		methods: {
			

			async clickButton() {
				if (parseInt(this.statusData.flowStatus) === 1 || this.statusData.flowStatus === undefined) {
					if (!this.agreeRules) {
						this.$dialog.alert('请先阅读信用助学计划须知全文，并同意方可进行下一步');
						return false;
					}

					if (!this.$env.custId) {
						await this.$user.login();
						await this.getFlowStatus();
					}
				}
				if (this.buttonData.link) {
					this.$router.push(this.buttonData.link)
				}
			},
			showRulesContent() {
				this.$refs.rulesContent.open();
			},
			hideRules() {
				this.$refs.rulesContent.close();
			},
			showIntroContent() {
				this.$refs.introContent.open();
			},
			hideIntro() {
				this.$refs.introContent.close();
			}
		},
		created() {
			this.$http.get('/services/app/v1/goods/getGoodsByAssort/1/3?assortId=1').then(response => {
				let resData = response.data;
				if (resData.code === '200') {
					resData = resData.data;
					this.productList = resData.entities;
				} else {
					this.$toast(resData.msg);
				}
			})
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.xyzx-index {
		height: calc(100vh - 1.28rem);
		background: #fff;

		& .panel-products {
			& .panel-head {
				line-height: 54px;
			}
			& .panel-more {
				font-size: 14px;
			}

			& .panel-body {
				padding-top: 0;
				padding-bottom: 0;
			}
			& .product-item {



			}
			& .product-radio {
				display: none;
			}
		}
		& .xyzx-content {
			padding: 0.4rem  .3rem;
			background: #fff;
		}
		& .button--block {
			max-width: 6rem;
			font-size: 16px;
			line-height: 1;
			padding: .4em 1em;
		}
		& .cover {
			height: 2.02rem;
			background-image: url(../../assets/image01@2x.jpg);
			background-repeat: no-repeat;
			background-position: center;
			background-size: 100% auto;
		}
		& .intro {
			margin-bottom: 0.4rem;
			&::before {
				opacity: 0.05;
			}
			& .text_card-content{
				/*display: -webkit-box;
				-webkit-box-orient: vertical;
				overflow: hidden;
				-webkit-line-clamp: 2;*/
				font-size: var(--default-font-size);
			}
		}

		& .products_entry {
			text-align: center;
			margin-top: .1rem;
			margin-bottom: .5rem;
		}


		& .approve-status {
			position: fixed;
			z-index: 3;
			bottom: 0;
			left: 0;
			right: 0;
			background: #fff;
			margin: 0 auto;
			padding: 10px 0;
			border-top: 1px solid var(--border-color);
		}

		&:after {
			content: "";
			display: block;
			padding-bottom: 63px;
		}

		& .rules-wrap {
			display: flex;
			flex-direction: column;
			height: 80vh;
			padding: .2rem .3rem;
			& .text_card-title, & .action {
				flex: 0 0 auto;
			}
			& .rules-content {
				flex: 1 1 auto;
				margin-bottom: .2rem;
				overflow-x: hidden;
				overflow-y: auto;
				& h4 {
					margin-top: .15rem;
					line-height: 1.4;
					font-weight: 700;
				}
				& h5 {
					font-size: 16px;
					margin: .1rem 0;
					font-weight: 700;
				}
				& h6 {
					font-size: 14px;
					line-height: 1.4;
				}
				& p {
					text-indent: 2em;
					line-height: 25px;
				}
			}
		}
	}
</style>