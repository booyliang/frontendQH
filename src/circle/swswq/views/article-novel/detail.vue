<template>
	<div class="book_details" v-if="bookData.id">
		<y-nav :title="$R('book-details-title')" :menuData="['index', 'copy-url', 'report']"></y-nav>
	
		<div class="flow_detail">
			<y-item>
				<y-card :src="bookData.headImg" :title="bookData.nickName"  :to="`/user/${bookData.createUserId}`"  :assist="$R('book-details-assist')" slot="head"></y-card>
				<!--<y-button type="text" v-if= "showEdit "  @click.native="toEdit" slot="foot">{{$R('book-details-edit')}}</y-button>-->
			</y-item>
			<div class="book_item">
				<div class="book_item-instr">
					<div class="book_item-book-img" :style="`backgroundColor:`+ bookBgColor">
						<img v-if="bookData.imgUrl" :src="bookData.imgUrl" alt="">
					</div>
					<div class="book_item-title" v-text="bookData.title"></div>
					<div class="book_item-anthor">{{bookData.author}} {{$R('book-details-write')}}</div>
					<div class="book_item-from">{{$R('book-details-from')}}{{bookData.bookSource}}</div>
					<div class="book_item-category" v-text="bookData.categoryName"></div>
					<div class="book_item-grade" v-if="bookData.grade">
						<span class="grade" :class="gradeRating"></span>
						<span class="total-grade" v-text="bookData.grade"></span> {{$R('book-details-grade')}}
					</div>
					<div class="book_item-no_grade" v-else>
						{{$R('book-details-no-score')}}
					</div>
				</div>
				<div class="book_item-score">
					<div><span>{{$R('book-details-my-grade')}}</span>
					     <span class="grade" :class="myGrade"></span>
					</div>
					<y-button @click.native="openScore">{{bookData.userGrade ? this.$R('book-details-modify-score') : this.$R('book-details-goto-score')}}</y-button>
				</div>
				<y-modal ref="scoreModal" :options="{onClosed:handleModalClosed}" >
					<div class="score_Con">
						<div class="score_Con-result" v-text="scoreResult"></div>
						<score @updataScore ="changeScore" :scoreNum = "selectScore"></score>
						<button class="button button--block" @click="handerScoreOk" :disabled= "selectScore === null"> {{$R('book-details-ok-btn')}}</button>
					</div>
				</y-modal>
				<template v-if="bookData.content">
					<div class="book_item-info">{{$R('book-new-bookcontent')}}</div>
					<y-content-source :content-source="contentSource"></y-content-source>
					<!--<div class="book_item-info-content">{{bookData.content}}</div>-->
				</template>
				
			</div>
		</div>
		<y-hot :hots="['forward']" :data="bookData"></y-hot>
		<y-comment v-if="bookData" :data="bookData"></y-comment>
	</div>
</template>
<script>
import Card from '@/components/card'
import List from '@/components/list'
import Item from '@/components/item'
import Hot from '@/components/hot'
import Comment from '@/components/comment'
import Modal from '@/components/modal';
import SCore from '@/components/score';
import ContentSource from '@/components/content-source'
export default {
	components: {
		[Card.name]: Card,
		[List.name]: List,
		[Item.name]: Item,
		[Hot.name]: Hot,
		[Comment.name]: Comment,
		[Modal.name]: Modal,
		[SCore.name]: SCore,
		[ContentSource.name]: ContentSource,
	},
	data() {
		return {
			bookData: {},
			selectScore: 0, // 评分弹出默认评分值
			contentSource: '[]',
		}
	},
	created() {		
		// 图书详情
		this.getBookData();
	},
	computed: {
		showEdit() {
			
			return this.bookData.referrerId && this.bookData.referrerId.toString() === this.$env.userId;
			
		},
		// 书没有封面图时候，随机生成背景色
		bookBgColor() {
			let colors = ["#facc7c", "#8ec6f6",  "#75e4bc"];
			if (!this.bookData.id ) {
				return '#fff'; 
			}
			if (this.bookData.imgUrl) {
				return 'transparent';
			}
			return colors[ this.bookData.id % colors.length];
		},
		gradeRating() { // 总评分
			let num = Math.ceil(this.bookData.grade);
			return 'grade' + num;
		},
		myGrade() {
			return 'grade' + this.bookData.userGrade;
		},
		scoreResult() { // 弹出框评分显示 未评分/ **分
			return this.selectScore === null ? this.$R('book-details-no-grade') : this.selectScore + this.$R('book-details-grade');
		},
	},
	watch: {
		bookData(val) {
			if (val) {
				this.selectScore = this.bookData.userGrade;
				this.contentSource = this.bookData.contentSource;
			}
		}
	},

	methods: {
		handleModalClosed() {
			this.selectScore = this.bookData.userGrade;
		},
		getBookData() {
			this.$http.get(`/services/app/v1/book/single/${this.$route.params.id}`)
			.then(res => {
				if (res.data.code === '200') {
					let data = res.data.data;
					this.bookData = data;
					this.bookData.moduleEnum = '10081'
				}
				console.log("bookData:", JSON.stringify(this.bookData))
			})
		},

		toEdit() {
			this.$localStore.set('bookData', this.bookData);
			console.log(JSON.stringify(this.bookData))
			this.$router.push({ path: '/book/new/1' });
		},

		openScore() { // 评分
			this.$refs['scoreModal'].open();
		},
		changeScore(val) {  // 点击评分星星时
			this.selectScore = val;
		},
		async handerScoreOk() { // 评分确认按钮
			let res;
			let params = {
				bookId: this.$route.params.id,
				grade: this.selectScore
			}
			if (this.bookData.userGrade === null) { // 用户没有评分  评分接口
				res = await this.$http.post(`/services/app/v1/bookgrade/single`, params)

			} else { // 修改评分接口
				res = await this.$http.put(`/services/app/v1/bookgrade/single`, params)				
			}

			if (res.data.code === '200') {
				this.$refs['scoreModal'].close();
			}
			
			this.getBookData();


		}
		

	}
}
</script>
<style>
@import '#/css/var.css';
.book_details {
	& .flow_detail {
		padding: 0 0 .4rem 0;
		& .item {
			& .item-wrap {
				border-top: none;
			}
		}
		& .book_item {
			background: #fff;
			padding: .1rem .3rem;
			& .book_item-instr {
				text-align: center;
				line-height:1.6;
				color:#000;
				& .book_item-book-img{
					display:block;
					margin: 0 auto;
					width: 2rem;
					height: 2.87rem;
					& img {
						display: block;
						width:100%;
						height:100%;
					
				}
				}
				
				& .book_item-title {
					font-size: 22px;
					margin-top: .2rem;
				}
				& .book_item-anthor {
					margin: .1rem 0;
				}
				& .book_item-from {
					color: var(--text-assist-color);
					margin-bottom: .1rem;
				}
				& .book_item-category {
					display: inline-block;
					color: #049C76;
					border: 1px solid #049C76;
					padding: .05rem .2rem;
					border-radius: 3px;
					line-height: 1;
					margin: .1rem auto .2rem;
					font-size: 14px;
				}
				& .book_item-grade {
					font-size: 12px;
					color: #333;
					display: flex;
					justify-content: center;
					align-items: center;
					& .total-grade {
						font-size: 16px;
						line-height: 20px;
						height: 20px;
						color: #049C76;
					}
				}
				& .book_item-no_grade {
					font-size: 15px;
					color: #666;
				}
				& .y_card-text {
					& .edit {}
				}
			}
			& .book_item-score {
				padding: .2rem 0;
				margin: .4rem 0;
				@apply --display-flex;
				justify-content: space-between;
				@apply --border-top;
				@apply --border-bottom;
				& div {
					@apply --display-flex;
				}
				& .button {
					padding: 0.15em .5em;
				}
			}
			& .book_item-info {
				text-align: center;
				margin-bottom: 5px;
			}
			& .book_item-info-content{
				font-size: 17px;
				line-height: .56rem;
				color: #000;
			}
		}
		& .grade {
			display: inline-block;
			width: 2.84rem;
			height: .35rem;
			background: url('../../assets/book-rating.png') no-repeat;
			background-size: 100% auto;
			background-position: 0 -3.5rem;
		}
		& .grade.grade0 {
			background-position: 0 -3.5rem;
		}
		& .grade.grade1 {
			background-position: 0 -3.15rem;
		}
		& .grade.grade2 {
			background-position: 0 -2.8rem;
		}
		& .grade.grade3 {
			background-position: 0 -2.45rem;
		}
		& .grade.grade4 {
			background-position: 0 -2.1rem;
		}
		& .grade.grade5 {
			background-position: 0 -1.75rem;
		}
		& .grade.grade6 {
			background-position: 0 -1.4rem;
		}
		& .grade.grade7 {
			background-position: 0 -1.05rem;
		}
		& .grade.grade8 {
			background-position: 0 -0.7rem;
		}
		& .grade.grade9 {
			background-position: 0 -0.35rem;
		}
		& .grade.grade10 {
			background-position: 0 0rem;
		}
		& .score_Con{
			width: 5.22rem;
			height:3rem;
			padding: 20px 0 0;
			& .score_Con-result{
				display: flex;
				justify-content: center;
				align-items: center;
				text-align:center;
				font-size:18px;
				color:#000;
				margin-bottom:0.3rem;
			}
			& .button--block{
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				border-top-right-radius: 0;
				border-top-left-radius:0;
				background: #f8f8f8;
				color:#333;
				font-size: 15px;
			}
		}
	}

}
</style>