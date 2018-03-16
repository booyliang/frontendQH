<template>
	<div class="heat" @click.stop="updateHeat()">
		<y-badge class="like-count" :hidden="!likeCount" :value="likeCount" :max="9999">
			<span class="iconfont icon-thumb-big" :class="[{ 'active': likeFlag}]"></span>
		</y-badge>
		<!-- <strong v-text="likeCount" class="heat-item-value"></strong> -->
	</div>
</template>
<script type="text/javascript">
import YBadge from '@/components/badge'
import Toast from '@/components/toast'
export default {
	name: 'y-comment-heat',
	components: {
		YBadge
	},
	props: {
		data: Object,
		useOpusApi: Boolean,
	},
	data() {
		return {
			likeCount: this.data.likeCount,
			likeFlag: this.data.likeFlag,
			disable: true
		};
	},
	watch: {
		data(newVal, oldVal) {
			this.likeCount = this.data.likeCount;
			this.likeFlag = this.data.likeFlag === 1;
		}
	},
	methods: {
		async updateHeat() {
			await this.$user.login();
			if (!this.useOpusApi && !this.$env.userId) {
				return;
			}
			let params = {
				infoId: this.data.id,
				targetUserId: this.data.createUserId,
				moduleEnum: "0061",
				targetResourceId: this.data.resourceId,
				coterieId: this.data.coterieId,
			};
			if (this.disable) {
				this.disable = false;
				let res = null;
				if (this.useOpusApi) {
					res = await this.$opusApi.post('/yyl/v1/like/single', params);
				} else {
					res = await this.$http.post('/services/app/v1/like/single', params);
				}
				if (res.data.code === "200" || res.data.ret === 1) {
					this.likeFlag = !this.likeFlag;
					if (this.likeFlag) {
						this.likeCount++;
					} else {
						this.likeCount--;
					}
				} else {
					Toast(res.data.msg);
				}
				this.disable = true;
			}
		}
	}
};
</script>
<style type="text/css">
@import '#/css/var.css';

.heat {
	line-height: 1;
	@nest .flow & {
		clear: both;
		text-align: right;
		margin-top: 0.3rem;
	}
	& .icon-thumb-big.active {
		color: var(--theme-color)!important;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		-webkit-appearance: none;
	}
}

.button.heat-item {
	height: 1.5em;
	font-size: .24rem;
	color: #7d7d7d;
	border: none;
	border-radius: 0;
	padding: 0;
	&:not(:first-child) {
		margin-left: 0.3rem;
	}
	& .icon {
		display: inline-block;
		width: 0.3rem;
		height: 0.3rem;
		margin-right: 0.5em;
		margin-bottom: 0;
		float: left;
	}
	&:disabled {
		color: #7d7d7d;
	}
}

.heat-text {
	& .heat-item {
		color: var(--text-assist-color);
	}
	& .heat-item-value {
		color: #00aff7;
	}
}


/*详情页  点赞 打赏*/

.heat.heat-detail {
	text-align: center;
	padding-top: 0.7rem;
	display: flex;
	justify-content: center;

	& .button.heat-item {
		width: 1.2rem;
		height: 1.2rem;
		background: var(--bg-color);
		@apply --circle;
		display: block;
		-webkit-tap-highlight-color: color(#000 alpha(0));

		& .icon {
			float: none;
		}

		& .heat-item-value {
			display: block;
			font-size: .24rem;
			color: var(--text-assist-color);
			margin-left: 0;
		}
	}

	& .button.heat-item:not(:first-child) {
		margin-left: 0;
	}

	& .button.heat-item.heat-item-comment {
		display: none;
	}

	& .button.heat-item:last-child {
		margin-left: 1.1rem;
	}

	& .button.heat-item-like {
		& .icon {
			width: 0.56rem;
			height: 0.54rem;
			margin: 0 auto;
			margin-top: 0.06rem;
		}
	}

	& .button.heat-item-forward {
		& .icon {
			width: 0.62rem;
			height: 0.66rem;
			margin: 0 auto;
		}
	}
}
</style>
