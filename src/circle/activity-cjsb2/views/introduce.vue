<template>
	<div class="temporary_activity-introduce">
		<div class="intro_banner">
			<div class="activity-cover">
				<img src="../assets/intro_banner.png" alt="">
			</div>
			<!--活动未开始 或 活动进行中-->
			<div class="activity-date">
				<div class="activity-count-down" v-if="activityStatus !== 3">
					<span class="head-icon">
						<span class="iconfont icon-clock"></span>
						<span v-text="showTipText"></span>
					</span>
					<y-count-down v-if="currDate && showCount" :endDate="endTime" :nowDate="currDate" @countdown_end="countdownEnd"></y-count-down>
				</div>
				<!--活动进行中 活动已结束-->
				<div class="activity-ended" v-else>
					<span class="iconfont icon-clock"></span>
					<span>活动已结束</span>
				</div>
			</div>
		</div>
		<div class="intro_content">
			<h3>
				<span>活动介绍</span>
			</h3>
			<p>
				长江商报·红牛2017大学生艺术创业大赛由知音传媒集团主办，长江商报承办，北京红牛销售有限公司湖北分公司、京天、Intel、RIO、网易湖北、圈乎等知名机构联合打造。本次大赛以积极响应和宣导《百万大学生留汉创业就业计划》为风向标，助力大学生就业创业，旨在通过本次大赛增强大学生实践能力、创新能力与合作意识，推动人才培养模式和实践教学的改革，为优秀人才搭建展现自我的平台。
			</p>
			<p>
				本次大赛集合了来自中国地质大学、湖北大学、中南民族大学、湖北工业大学、武汉轻工大学、武汉学院、武昌工学院、武汉工程科技学院、武汉职业技术学院、长江职业学院等十余所高校的参赛选手，大家将通过本次大赛的艺术设计创作赛段、艺术设计实战营销赛段（实战营销+线上投票）和总决赛赛段一决高下。
			</p>
		</div>
		<div class="intro_content">
			<h3>
				<span>投票规则</span>
			</h3>
			<p>
				<i>1</i>通过大赛艺术设计创作赛段评选，各参赛高校入围校级十强的参赛选手，在大赛投票平台上，上传选手相关信息及参赛作品信息，内容包括：所属院校、专业、姓名、参赛作品图片和作品设计理念阐述。
			</p>
			<p>
				<i>2</i>参赛选手可通过正常传播和投票手段为自己进行拉票（每个IP每日可投5票），线上投票的过程中，一旦出现恶意刷票等作弊行为，将直接取消投票成绩，并根据情况决定是否取消其在本次大赛中的参赛资格。
			</p>
			<p>
				<i>3</i>上传参赛作品的选手，需保证所提交作品的原创性和信息的真实性，一经发现作品涉及抄袭和虚假信息，将取消参赛资格。
			</p>
		</div>

		<div class="intro_content">
			<h3>
				<span>大赛奖金</span>
			</h3>
			<p> 冠军：奖金3000元并颁发证书 </p>
			<p> 亚军：奖金2000元并颁发证书 </p>
			<p> 季军：奖金1000元并颁发证书 </p>
			<p> 十佳作品奖（10支）：奖金1000元并颁发证书 </p>
			<p> * 各高校校级十强选手均颁发证书 </p>
			<p> * 各高校校级冠军选手均颁发证书 </p>
			<p> * 优秀团队均有机会获得名企实习或就业机会 </p>
		</div>
	</div>
</template>
<script>
import CountDowm from './components/count-down';
import moment from 'moment'
export default {
	name: 'activityIntroduce',
	components: {
		[CountDowm.name]: CountDowm,
	},
	data() {
		return {
			beginDate: '2017-12-04 00:00:00',
			endDate: '2017-12-15 23:59:59',
			currDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
			// currDate: '2017-12-03 23:59:55',  // 测试
			showCount: true,
			activityStatus: null,
		}
	},
	computed: {
		endTime() {
			return this.activityStatus === 1 ? this.beginDate : this.endDate;
		},
		showTipText() {
			return this.activityStatus === 2 ? '距离活动结束还有' : '距离活动开始还有';
		}
	},
	created() {
		// this.$toast(this.currDate);
		this.getActivityStatus();
	},
	methods: {
		getActivityStatus() {
			let beginTime = this.getTime(this.beginDate);
			let endTime = this.getTime(this.endDate);
			let currTime = this.getTime(this.currDate);

			if (currTime - beginTime < 0) {
				this.activityStatus = 1;
			} else {
				if (currTime - endTime < 0) {
					this.activityStatus = 2;
					return false;
				}
				this.activityStatus = 3;
			}
		},
		// 倒计时结束
		countdownEnd() {
			if (this.activityStatus === 1) {
				this.showCount = false;
				this.$nextTick(() => {
					this.activityStatus = 2
					this.showCount = true;
				})
			} else if (this.activityStatus === 2) {
				this.showCount = false;
				this.activityStatus = 3
			}
		},
		getTime(date) {
			if (!date) {
				this.$toast('date不对为空')
				return false;
			}
			let dateArr = date.split(/[- :]/);
			if (!dateArr.length) {
				this.$toast('请传入正确的时间格式 xxxx-xx-xx xx:xx:xx')
				return false
			}
			const endDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], dateArr[3], dateArr[4], dateArr[5]);
			return endDate.getTime();
		}
	}
}
</script>

<style>
@import '#/css/var.css';
.temporary_activity-introduce {
	& .intro_banner {
		width: 100%;
		height: 3.36rem;
		overflow: hidden;
		position: relative;

		& img {
			width: 100%;
			height: 100%;
		}
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
			font-size: 15px;
			line-height: .4rem;
			& .head-icon {
				& .iconfont {
					font-size: 17px;
				}
			}
		}
		& .activity-ended {
			text-align: center;
			& .iconfont {
				font-size: 17px;
			}
		}
	}


	& .intro_content {
		padding: .2rem .4rem;
		color: var(--text-secondary-color);
		& h3 {
			font-size: .36rem;
			position: relative;
			margin-bottom: .2rem;
			& span {
				margin-left: .2rem;
			}

			&::before {
				content: "";
				position: absolute;
				width: .08rem;
				height: .36rem;
				background: #e6002e;
				margin-right: .2rem;
				top: .08rem;
			}
		}
		& p {
			text-align: justify;
			font-size: .28rem;
			line-height: .45rem;
			margin-bottom: .2rem;

			& i {
				display: inline-block;
				width: .35rem;
				height: .35rem;
				background: #f5204a;
				@apply --circle;
				color: #fff;
				line-height: .35rem;
				text-align: center;
				margin-right: .15rem;
			}
		}
	}
}
</style>
