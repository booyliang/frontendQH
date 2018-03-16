<template>
	<div class="candidate_item">
		<router-link :to="link" class="flow_item-body">
			<span class="rank-number" :class="{'first': ranking === 1}" v-if="ranking">{{ ranking }}</span>
			<div class="candidate_item-main">
				<div class="candidate_item-cover">
					<img :src="data.coverPlan | imageResize(11)">
				</div>
				<div class="candidate_item-content">
					<h3 class="candidate_item-title">{{ data.title }}</h3>
					<p class="candidate_item-school">{{ data.schoolName }}</p>
					<p class="candidate_item-slogan">{{ data.content }}</p>
				</div>
			</div>
			<div class="candidate_item-info">
				<dl class="info_item">
					<dt>编号：</dt>
					<dd>{{ data.voteNo }}</dd>
				</dl>
				<dl class="info_item vote_count">
					<dt>票数：</dt>
					<dd>{{ voteCount }}</dd>
				</dl>
			</div>
		</router-link>
		<div class="foot_button">
			<y-button type="text" @click.native.stop="toShare">帮TA拉票</y-button>
			<span></span>
			<y-button type="text" @click.native.stop="voted">投TA一票</y-button>
		</div>
	</div>
</template>

 <script>
	import Dialog from '@/components/dialog';
	import Action from '@/components/comment/action';
	export default {
		name: 'y-candidate-item',
		props: {
			index: Number,
			data: {
				type: Object,
				required: true
			},
			showSort: {
				type: Boolean,
				default: false
			},
			sort: Number,
			noVote: Boolean,
		},
		computed: {
			ranking() {
				if (this.index === 0 || this.index) {
					let result = this.index + 1;
					return result;
				}
			},
			link() {
				return {name: 'detail', params: {id: this.data.id}};
			},
			voteCount() {
				return this.data.voteCount + this.vote;
			}
		},
		data() {
			return {
				vote: 0
			}
		},
		methods: {
			toShare() {
				this.$router.push({
					name: 'detail',
					params: {
						id: this.data.id
					}
				});
			},
			async voted() {
				if (this.inApp) await this.$user.login();
				if (!this.$env.custId) {
					this.$eventBus.$emit('login');
					return;
				}
				this.$indicator.open('投票中...');
				let response = await this.$http.post(`/services/app/v1/temp/activity/vote/opus`, {candidateId: this.data.id})
				this.$indicator.close();
				let resData = response.data;
				if (resData.code === '200') {
					this.$eventBus.$emit('voteToast', 'success');
					this.vote ++;
				} else if (resData.code === '1078') {
					this.$eventBus.$emit('voteToast', 'error');
				} else {
					this.$toast(resData.msg);
				}
			}
		}
	};
</script>

<style>
	@import '#/css/var.css';
	.candidate_item {
		position: relative;
		margin: .3rem .2rem;
		box-shadow: 0 0 .12rem rgba(51, 51, 51, .3);
		border-radius: .12rem;
		background-color: #FFF;
		& .rank-number {
			position: absolute;
			left: -.1rem;
			top: .2rem;
			width: .9rem;
			line-height: .4rem;
			background: #ffe455;
			color: #8d640d;
			text-align: center;
			font-size: 12px;
			border-top-right-radius: .1rem;
			border-bottom-right-radius: .1rem;
			&:before {
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				transform: translateY(100%);
				width: 0;
				height: 0;
				border-width: .05rem;
				border-style: solid;
				border-color: #bc8e13 #bc8e13 transparent transparent;
			}
			&.first {
				color: #fff;
				background: #fb4545;
				&:before {
					border-color: #a51e1e #a51e1e transparent transparent;
				}
			}
		}
		& .candidate_item-main {
			display: flex;
			padding: .3rem .3rem 0;
		}
		& .candidate_item-cover {
			width: 2.5rem;
			height: 1.4rem;
			flex: 0 0 2.5rem;
			overflow: hidden;
			& img {
				width: 100%;
				height: 100%;
				background: #ccc;
			}
		}
		& .candidate_item-content {
			flex: 1;
			width: 3.9rem;
			margin-left: .2rem;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
		& .candidate_item-title,
		& .candidate_item-school,
		& .candidate_item-slogan {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		& .candidate_item-title {
			font-size: .36rem;
		}
		& .candidate_item-school,
		& .candidate_item-slogan {
			font-size: .3rem;
			color: #333;
		}
		& .candidate_item-slogan {
			color: var(--text-tips-color);
		}
		& .candidate_item-info {
			padding: 0.2rem .3rem;
			display: flex;
			justify-content: space-between;
			& .info_item {
				display: flex;
				&.vote_count dd{
					color: #f8bc1a;
				}
			}
		}
		& .foot_button {
			display: flex;
			justify-content: space-around;
			color: var(--theme-color);
			background-color: #F8F8F8;
			& .button {
				flex: 1;
				&:last-child {
					font-weight: bold;
				}
			}
			& .disabled {
				color: var(--text-tips-color);
			}
			& span {
				display: inline-block;
				margin: .15rem 0;
				border-right: 1px solid var(--border-color);
			}
		}
	}
</style>
