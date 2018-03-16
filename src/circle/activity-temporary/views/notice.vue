<template>
	<div class="temporary_activity-notice">
		  <h3 class="title">“长江商报•洋码头首届武汉大学生跨境电商创业大赛”初赛成绩公布</h3>
          <p class="sub">精彩的初赛对决</p>
          <p>由知音传媒集团主办，长江商报承办，光谷创业咖啡、光谷创+、网易湖北、Today便利店、圈乎等知名机构特别合作的“长江商报•洋码头首届武汉大学生跨境电商创业大赛”的初赛段已结束。</p>
          <p>来自武汉二十余所高校的数百只团队，经过激烈的对决，终于决出了120强，他们天马行空的创意方案和兢兢业业的实操经历都让人为之侧目。</p>
          <p>此外还要恭喜进入120强的选手们，你们已经成功入选大赛的“ICAN精英计划”，成为该计划成员后除了可以获得组委会提供的聘书和证书以外，大赛组委会还将邀请资深创业导师对优秀成员进行创业培训和就业指导，最后还会联合知名创业孵化器对优秀创业项目进行帮扶。</p>
          <p><img src="../assets/vote_notice1.png" alt="活动资讯"></p>
          <p><img src="../assets/vote_notice2.png" alt="活动资讯"></p>
          <p class="sub">复赛对决即将开始</p>
          <p>接下来，这120只参赛队伍即将要进入大赛的复赛阶段。</p>
          <p>相比于初赛阶段，复赛阶段的整体考核将更加的多元化，也对选手的创意思维、执行能力和创业精神有了更加严峻的挑战。</p>
          <p>复赛阶段将于10月30日开始，至11月19日结束，而比拼内容将从以下三个方面开展。</p>
          <p><img src="../assets/intro_banner.png" alt="活动资讯"></p>
          <p>1.实战创意营销分数50%+</p>
          <p>（难度加码10%）+（额外加分10%）</p>
          <p>2.线上投票30%</p>
          <p>3.初赛分数20%</p>
          <p class="sub mt">120强团队名单</p>
          <p>以下是进入120强的团队名单。</p>
          <p>（排名按照各学校组织者提交全部资料的顺序而定）</p>

          <div class="tab_main">
			  <dl class="school_items" v-for="(item, index) in itemList" :key="index">
				  <dt>{{ item.name }}</dt>
				  <dd>&nbsp;</dd>
				  <dd v-for="(team, tIndex) in item.teams" :key="tIndex">{{ team }}</dd>
				  <dd>&nbsp;</dd>
			  </dl>
	          <!-- <table class="table_list" v-for="(item, index) of itemList" :key="index" cellpadding="0" cellspacing="0">
	            <tr>
	               <td class="td1">{{item.name}}</td>
	               <td>
	               	  <ul>
	               	  	 <li v-for="(team, i) of item.teams" :key="i">{{ team }}</li>
	               	  </ul>
	               </td>
	            </tr>
	         </table> -->
          </div>

	</div>
</template>
<script>
	import moment from 'moment'
	import YCountdown from './components/count-down'
	const dateFormat = 'YYYY-MM-DD HH:mm:ss';
	export default {
		components: {
			YCountdown
		},
		data() {
			return {
				beginDate: moment('2017-10-30 00:00:00').format(dateFormat),
				nowDate: moment().format(dateFormat),
				endDate: moment('2017-11-19 23:59:59').format(dateFormat),
				itemList: [
					{
						name: '武汉工程大学',
						teams: [
							'BOS队',
							'DS-6顺团',
							'K.U迪队',
							'NGU队',
							'β队',
							'薄荷绿队',
							'点码头队',
							'恒梦战队',
							'梦之队',
							'企通队',
							'神秘小队',
							'引力波队',
							'勇士组',
							'主旋律队',
						]
					},
					{
						name: '武汉轻功大学',
						teams: [
							'闯码头',
							'dream high队',
						]
					},
					{
						name: '武汉商贸职业学院',
						teams: [
							'爆炸小组',
							'军队',
						]
					},
					{
						name: '武汉交通职业学院',
						teams: [
							'萬盛天虹',
							'畅想青春',
							'无敌美少女',
						]
					},
					{
						name: '湖北经济学院',
						teams: [
							'H&L',
							'The Creation',
							'Zenith',
							'带上董小姐',
							'VIP海淘',
							'WE',
							'摆渡人',
							'溜溜财团',
							'三二一',
							'易燃易爆炸',
							'非常6+2',
							'造梦者',
							'曌之队',
							'霸天虎',
							'风扬团队',
							'欧米伽',
							'铜雀春深队',
							'营销扛把子队',
							'主旋律队',
						]
					},
					{
						name: '中国地质大学',
						teams: [
							'南望特攻队',
							'c2c',
							'spontaneous',
							'电商之王',
							'南望不难忘',
							'钱多多',
							'一二三四',
						]
					},
					{
						name: '长江职业学院',
						teams: [
							'SA队',
							'only one队',
							'聚星团队',
							'牛X队',
							'同路人队',
							'小骄傲队',
							'越众队',
							'针尖队',
						]
					},
					{
						name: '武汉大学',
						teams: [
							'要你精彩队',
							'社会主义创业队',
						]
					},
					{
						name: '华中师范大学',
						teams: [
							'嗨个够队',
							'清荣队',
							'神厨大富贵队',
						]
					},
					{
						name: '华中农业大学',
						teams: [
							'山草队',
							'队长说的都队',
						]
					},
					{
						name: '湖北中医药大学',
						teams: [
							'酿梦卓队',
							'飞哥小队',
							'销才强队',
							'战狼计划',
						]
					},
					{
						name: '武汉工程科技学院',
						teams: [
							'coco队',
							'moming队',
							'YOUNG',
							'不吃胡萝卜队',
							'精英先锋营',
							'快乐队',
							'骊岸队',
							'未命名团队',
							'我来弄死你队',
							'选择题全队',
						]
					},
					{
						name: '武汉信息传播职业学院',
						teams: [
							'举世无双队',
							'电商天马行空队',
						]
					},
					{
						name: '武汉船舶职业技术学院',
						teams: [
							'火狼队',
							'雪狼队',
							'Nike队',
							'奇迹队',
						]
					},
					{
						name: '武昌工学院',
						teams: [
							'KD队',
							'筑梦队',
							'众志队',
							'起帆队',
							'腾飞队',
							'666队',
							'梦之队',
							'地中海队',
							'地表最强队',
							'对与不队',
						]
					},
					{
						name: '武汉体育学院',
						teams: [
							'科比队',
							'有我无敌队',
							'销售强队',
							'小鸡哔哔',
							'放肆去嗨',
						]
					},
					{
						name: '中南财经政法大学',
						teams: [
							'lucky',
							'不是坏人队',
							'电光火石队',
							'鹿晗的后宫队',
							'太阳的后裔队',
						]
					},
					{
						name: '东湖学院',
						teams: [
							'小米队',
							'大米队',
							'钢铁侠队',
							'梦想之队',
						]
					},
					{
						name: '中南民族大学',
						teams: [
							'穆斯兰道队',
							'罗格队',
							'搓个炉石队',
							'mimi秘密',
						]
					},
					{
						name: '湖北第二师范大学',
						teams: [
							'灵魂之火',
							'赚点小钱队',
						]
					},
					{
						name: '武汉生物工程学院',
						teams: [
							'牛仔枪手队',
							'super queen',
							'碧秀河山队',
						]
					},
					{
						name: '武汉城市职业学院',
						teams: [
							'M&S',
							'1818队',
							'jar队',
							'德玛西亚队',
							'共进队',
						]
					},
				]
			}
		}
	}
</script>

<style>
	.temporary_activity-notice {
		padding: .1rem .4rem;
		text-align: justify;
		line-height: 1.6;
		& .title {
			margin: .1rem 0;
			font-size: .4rem;
           text-align: center;
		   font-weight: bold;
		}
		& .sub {
			font-size: .38rem;
			font-weight: bold; 
			border-bottom: 1px solid #e7e7e7;
		}
		& .mt { 
			margin-top: .5rem; 
		}
		& p ,& .tab_main {
			margin-top: .2rem;
		}
		& .table_list {
            width: 100%;
            margin-bottom: .1rem;
            border-top: 1px solid #999;
            border-right: 1px solid #999;
            & td {
            	width: 100%;
            	border-left: 1px solid #999;
            	border-bottom: 1px solid #999;

            	& ul {
            	   & li { padding-left: .2rem; }	
                   & li:not(:last-child) {
                      border-bottom: 1px solid #999;
            	   }
            	}
            	  
            }
            & .td1 {
               width: 50%;
               text-align: center;
            }
		}
		& .intro_banner {
			width: 100%;
			height: 3.36rem;
			overflow: hidden;

			& img {
				width: 100%;
				height: 100%;
			}
		}
		& .countdown_wrap {
			position: relative;
			z-index: 2;
			transform: translateY(-100%);
			padding: .3rem;
			text-align: center;
			color: #fff;
			background-color: rgba(0, 0, 0, .5);
		}
		& .school_items {
			text-align: center;
			border: 1px solid grey;
			& ~ .school_items {
				margin-top: .5rem;
			}
			& dt {
				line-height: .8rem;
				border-bottom: 1px solid grey;
			}
			& dd {
				line-height: .54rem;
			}
		}
	}	
</style>
