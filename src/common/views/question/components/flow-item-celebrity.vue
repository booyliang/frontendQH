<template>
	<div class="flow_item-celebrity">
		<y-card :title="data.nickName" :to="`/user/${data.userId}`" img-size="large" :badge="true" :src="data.userImg">
			<div slot="assist" class="flow_list_count">
				<span>回答 {{data.answerCount}}</span>
				<span>赞同 {{data.likeCount}}</span>
			</div>
		</y-card>
		<y-button type="ghost" @click.native="ask" v-if="!data.currUserFlag">咨询TA</y-button>
	</div>
</template>
<script>
import YCard from '@/components/card'
import YButton from '@/components/button'
export default {
	name: 'y-flow-item-celebrity',
	components: {
		YCard,
		YButton
	},
	props: {
		data: {
			type: Object,
			default: () => { return {} }
		}
	},
	methods: {
		ask() {
			this.$http.get(`/services/app/v1/question/count/${this.data.userId}`).then(response => {
				let resData = response.data;
				if (resData.code === '200') {
					let data = resData.data;
					if (parseInt(data.flag) === 1) {
						this.$toast('一天之内只能向三个问答明星提问');
						return false;
					} else if (parseInt(data.flag) === 2) {
						this.$toast('您今天已经向TA提问3次啦，请换个问答明星提问吧！');
						return false;
					}
					this.$router.push({ name: 'questionNew', params: { targetId: this.data.userId } });
				} else {
					this.$toast(resData.msg);
				}
			})

		}
	}
}
</script>
<style>
@import "#/css/var.css";
.flow_item-celebrity {
	@apply --display-flex;
	justify-content: space-between;
	padding: .3rem;
	@apply --border-bottom;
	background-color: #fff;
	& .y_card-title {
		font-size: 17px;
		margin-bottom: .3rem;
	}

	& .flow_list_count {
		font-size: 13px;
		color: var(--text-assist-color);
		& span:first-child {
			margin-right: .35rem;
		}
	}
	& .y_card {
		flex: 1 1 100%;
		padding-right: 0.2rem;
	}
	& .button {
		flex: 1 0 auto;
	}
}
</style>