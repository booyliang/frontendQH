<template>
	<y-list class="book-list">
		<router-link :to="`/book/detail/${data.id}`">
			<div class="flow_item-body">
				<div class="flow_item-cover">
					<img v-if="data.imgUrl" :src="data.imgUrl | imageResize(9)" class="flow_item-thumb">
					<div v-else class="flow_item-thumb flow_item-random-color" :style="`backgroundColor:`+ randomColor"><p> {{title}}</p></div>
					<div class="right-head">
						<span v-if="title" class="flow_item-title" v-text="title"></span>
						<span v-if="data.grade" class="grade" v-text="data.grade"></span>
					</div>
	
					<div v-if="data.content" class="flow_item-content intro" v-text="data.content"></div>
					<div class="right-foot">
						<div v-if="data.author" class="flow_item-content author">{{this.$R('book-new-author')}}：{{data.author}}</div>
						<div v-if="data.categoryName" class="flow_item-content label" v-text="data.categoryName"></div>
					</div>
				</div>
			</div>
		</router-link>
	</y-list>
</template>

<script>
import List from '@/components/list';

export default {
	name: 'y-book-item',
	components: {
		[List.name]: List,
	},
	props: {
		data: {
			type: Object,
			required: true
		},
		horizontal: Boolean,
		remove: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	created() {

	},
	computed: {
		title() {
			return this.cutstr(this.data.title, 7);
		},
		// 书没有封面图时候，随机生成背景色
		randomColor() {
			let colors = ["#facc7c", "#8ec6f6",  "#75e4bc"];
			if (!this.data.id ) {
				return '#fff'; 
			}
			return colors[ this.data.id % colors.length]; 

		},
	},
	methods: {
		cutstr(str, len) {
			let str_len = str.length;
			if (str_len >= len) {
				return str.substr(0, len ).concat("…")
			} else {
				return str;
			}
		},
	}
}
</script>

<style>
@import '#/css/var.css';
.book-list {
	margin: 0 .3rem;
	padding: .4rem 0;
	@apply --border-top;

	& .flow_item-body {
		& .flow_item-cover {
			position: relative;
			& .flow_item-thumb {
				width: 1.6rem;
				height: 2.3rem;
				margin-right: .3rem;
				
			}
			& .flow_item-random-color {
				padding: 10px;
				display: flex;
				justify-content: center;
				align-items: center;
				& p {
					color: #fff;
					font-size: 14px;
					@apply --text-cut-multi-line;
					text-overflow: ellipsis;
					-webkit-line-clamp: 2;
				}
			}
			& .right-head {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;
				align-items: flex-start;

				& .flow_item-title {
					line-height: 1;
					flex: 1;
				}

				& .grade {
					color: var(--theme-color);
					font-size: 20px;
					margin-top: -.1rem;
				}
			}

			& .intro {
				color: var(--text-assist-color);
				font-size: 15px;
			}
			& .right-foot {
				position: absolute;
				bottom: 0;
				left: 1.9rem;
				& .author {
					font-size: 13px;
					margin: .1rem 0;
					-webkit-line-clamp: 1;
				}
				& .label {
					color: var(--theme-color);
					font-size: 13px;
					border: 1px solid var(--theme-color);
					border-radius: .08rem;
					padding: .01rem .2rem;
					display: inline-block;
				}
			}
		}
	}
}

.book-list:nth-child(1) {
	border-top: none;
}
</style>


