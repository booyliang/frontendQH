<template>
	<div class="contract-wrap">
		<h1>产品信用赊销合同</h1>
		<h3>卖方：武汉海稻经济发展有限公司</h3>
		<h3>
			<dl>
				<dt>买方姓名：</dt>
				<dd>{{ contractData.name }}</dd>
			</dl>
		</h3>
		<h3>
			<dl>
				<dt>买方身份证号：</dt>
				<dd>{{ contractData.idCardNo }}</dd>
			</dl>
		</h3>
		<p>根据《中华人民共和国合同法》及其有关法律法规，为明确双方的权利义务，特订立本信用赊销合同。</p>

		<p>第一条  买方必须满足下列条件，方可申请由卖方提供的信用赊销额度最高不超过10万元的汉古海稻系列产品：</p>
		<p>1、买方必须为完全民事行为能力且无不良信用记录的自然人。</p>
		<p>2、买方同意遵守《“信用赊销”申请须知》的各项规定。</p>

		<p>第二条  买方所选购的信用赊销产品按下表列示的信用赊销价格结算，且买方必须按照商家公布的或合同中约定的市场统一零售价销售产品：  </p>
		<table>
			<tr>
				<th>产品名称</th>
				<th>规格型号</th>
				<th>单位</th>
				<th>数量</th>
				<th>信用赊销价格（元）</th>
				<th>市场统一零售价（元）</th>
			</tr>
			<tr v-for="item in contractData.items">
				<td>{{ item.productName }}</td>
				<td>{{ item.specifications }}</td>
				<td>{{ item.unitFlag }}</td>
				<td>{{ item.quantity }}</td>
				<td>{{ item.price | price }}</td>
				<td>{{ item.marketPrice | price }}</td>
			</tr>
			<!-- <tr>
				<td>货款总额</td>
				<td colspan="5">{{ contractData.totalMoney | price }}</td>
			</tr>
			<tr>
				<td>首付金额</td>
				<td colspan="5">{{ contractData.firstMoney | price }}</td>
			</tr> -->
			<tr>
				<td>赊销货款总金额</td>
				<td colspan="5">人民币(大写)：{{ contractData.loanMoney | price | digitUppercase }}；（小写：{{ contractData.loanMoney | price }} 元）</td>
			</tr>
		</table>
		<p>第三条 还款</p>
		<!-- <p>买方信用赊销货款总金额为{{ contractData.loanMoney | price }}元，
			买方选择分{{ contractData.periodCount }}个月还款，每月还款一次，还款金额为{{ contractData.repayMoney | price }}元。
		还款日期以发货之日起计算。具体还款时间，按“信用创富圈”——“个人中心”——“我要还款” 中的内容执行。买方可提前支付货款。
		</p> -->
		<p>买方信用赊销货款总金额为{{ contractData.loanMoney | price }}元，
					买方选择分{{ contractData.periodCount }}个月还款，每月还款一次，还款金额为
					<span v-for="item in repayMoney" key="item.count">{{item.count}}期：{{item.money | price}}元<span v-if="item.count !== contractData.periodCount">、</span></span>。
				还款日期以发货之日起计算。具体还款时间，按“信用创富圈”——“个人中心”——“我要还款” 中的内容执行。买方可提前支付货款。
				</p>
		<p>第四条  货物交付方式：</p>
		<p>1、如买方委托卖方邮寄，卖方仅免费向一个收货地址发货一次。如买方要求分地、分次发货，则运费由买方承担。</p>
		<p>2、买方自提的，凭身份证明等材料到卖方指定地点自提。</p>
		<p>3、如遇商家产品货源紧张，买方须按顺序等待商家安排发货，商家对发货时间不承担任责任。</p>
		<p>4、以邮寄方式交货，自卖方将货物交付给承运人（即：邮寄人）之日，该货物的法律风险责任转移至买方；买方自提的，自买方在提货单上签收之日法律风险责任转移至买方。</p>
		<p>第五条  验收标准、方法：</p>
		<p>1、采取邮寄方式的，买方应自收到邮寄的产品后应及时验货。如发现包装有破损，买方应拍摄照片保留依据并向承运人提出异议。如果需要，卖方可以协助买方向承运人主张权利。</p>
		<p>2、对买方自提的，买方应检验货物，包括检验包装、核对数量，已经买方签收提货，即视为买方对此不持异议。买方不得再提出退、换货要求。</p>

		<p style="font-weight: bold">特别提示：买方所购买或信用赊销的产品为食品，商家一旦发货后均不予以退、换货。 </p>

		<p>第六条  卖方的权利和义务：</p>
		<p>1、卖方保证交付的货物附带有产品合格相关标识（具体见内包装或外包装）。</p>
		<p>2、卖方对货物采取的包装：以实物为准。</p>
		<p>3、买方在无违约违规的情况下，按《“信用赊销”申请须知》的规定可循环使用信用赊销额度，但如买方未按时支付信用赊销货款，卖方有权对买方下次的信用赊销额度予以拒绝或卖方视买方违约情行调整、取消买方的信用赊销额度。</p>
		<p>4、卖方有权为保证其在本合同中的利益不受损害而要求买方补充、完善各类信息，包括对未付信用赊销货款提供相关担保。买方对此不持异议。如未按此办理则应承担违约责任，卖方亦有权单方解除本合同并要求买方全额支付信用赊销剩余货款。</p>

		<p>第七条  买方的权利和义务：</p>
		<p>1、买方保证其具备符合卖方规定的信用赊销条件和资格。如其提交的资料、信息有不完整、不清晰等情形的，买方同意按卖方要求的期限予以补充。</p>
		<p>2、买方保证其征信正常，无不良记录（包括各类黑名单）。买方同意卖方有权随时查询买方征信情况，如发现买方有不良记录，卖方有权视买方为根本违约并追究其法律责任。</p>
		<p>3、买方应按卖方通知或规定的期限提取货物，如逾期超过五个工作日，买方同意卖方有权按第八条约定行使权利。</p>

		<p>第八条  违约责任：</p>
		<p>1、如买方未按合同约定的市场统一零售价销售产品即构成根本违约。</p>
		<p>2、买方要求自提信用赊销产品，须在五个工作日内到卖方指定的提货地点提货。未在规定期限内提货的视同买方拒绝履行本合同并构成违约。如遇卖方货源紧张，买方同意按顺序等待卖方提货通知，如买方未按卖方通知的时间按时提货且超过五个工作日，视同买方拒绝履行本合同并构成违约。对前述买方违约行为，卖方均有权单方解除合同并保留要求买方按未按期提货金额的20%支付违约金的权利。</p>
		<p>3、如买方不按期支付货款，每逾期一日按照应付而未付款金额的万分之五向卖方支付违约金。卖方有权将买方不良信用记录向征信系统管理平台披露，买方不持异议。</p>
		<p>4、如买方有违反本合同规定的行为，卖方均有权行使如下权利：要求纠正违约行为、采取补救措施、解除合同、赔偿损失。</p>
		<p>第九条 通知</p>
		<p>1、卖方对买方发出与本合同有关的通知等函件，卖方可以采取如下方式：短信、微信通知、电子邮件、专递、当面送交、报纸公告等方式。</p>
		<p>2、买方对卖方发出与本合同有关的通知等函件，买方应采取如下方式：特快专递（EMS）、当面送交给卖方办公地点的前台工作人员。</p>
		<p>第十条  法律适用及解决合同纠纷的方式：</p>
		<p>1、本合同适用中华人民共和国的法律并受其管辖。</p>
		<p>2、在履行合同的过程中发生争议，双方应当协商解决，协商不成或不愿协商的，双方选择在卖方办公所在地（武汉东湖新技术开发区）的人民法院诉讼解决。</p>
		<p>第十一条 其他：</p>
		<p>1、除非存在明确的书面表示，否则本合同任何一方未行使或迟延行使本合同项下的权利并不构成对该权利的放弃，单一或部分地行使某项权利并不排斥对任何其它权利的行使。</p>
		<p>2、本合同中使用的标题仅为阅读方便而设,在任何情况下均不影响对本合同内容的解释。</p>
		<p>3、本合同签订时，各方已提请相对方注意本合同中有关加重、限制或免除各方责任的条款，并按照相对方的要求，对该条款作了说明。本合同各方对本合同所有条款均完全理解并认可接受。</p>
		<p>4、未尽事宜，双方协商签订补充合同书，该补充合同书与本合同具有同等法律效力。</p>
		<p>5、本合同自双方签章后生效，买方在线签署合同同样具有法律效力。</p>
		<h3>
			<dl>
				<dt>卖方：</dt>
				<dd>
					<div>武汉海稻经济发展有限公司</div>
					<div>{{ contractData.date }}</div>
				</dd>
			</dl>
		</h3>
		<h3>
			<dl>
				<dt>买方：</dt>
				<dd>
					<div>{{contractData.name}}</div>
					<div>{{ contractData.date }}</div>
				</dd>
			</dl>
		</h3>
	</div>
</template>
<script>
	import moment from 'moment'
	export default {
		data() {
			return {
				contractData: {},
				repayMoney: []
			}
		},
		mounted() {
			let date = moment().format('LL');
			this.contractData = this.$localStore.get('contractData') || {
				// loanMoney: 70000,
				// periodCount: 6
			}
			this.contractData.date = date;
			for (var i = 1; i <= this.contractData.periodCount; i++) {
				if (i === 1) {
					this.repayMoney.push({'count': i, 'money': parseInt(this.contractData.loanMoney / this.contractData.periodCount) + this.contractData.loanMoney % this.contractData.periodCount})
				} else {
					this.repayMoney.push({'count': i, 'money': parseInt(this.contractData.loanMoney / this.contractData.periodCount)})
				}
			}
		},
		filters: {
			digitUppercase: function (n) {
				if (typeof n === 'undefined')
					return ''
				var fraction = ['角', '分'];
				var digit = [
					'零', '壹', '贰', '叁', '肆',
					'伍', '陆', '柒', '捌', '玖'
				];
				var unit = [
					['元', '万', '亿'],
					['', '拾', '佰', '仟']
				];
				var head = n < 0 ? '欠' : '';
				n = Math.abs(n);
				var s = '';
				for (var i = 0; i < fraction.length; i++) {
					s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
				}
				s = s || '整';
				n = Math.floor(n);
				for (let i = 0; i < unit[0].length && n > 0; i++) {
					var p = '';
					for (var j = 0; j < unit[1].length && n > 0; j++) {
						p = digit[n % 10] + unit[1][j] + p;
						n = Math.floor(n / 10);
					}
					s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
				}
				return head + s.replace(/(零.)*零元/, '元')
					.replace(/(零.)+/g, '零')
					.replace(/^整$/, '零元整');
			}
		}
	}
</script>
