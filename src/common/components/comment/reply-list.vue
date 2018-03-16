<template>
	<div class="replies">
		<ol class="reply-list">
			<li class="reply-item" v-for="(reply, index) of data" :key="index" @click.stop="handleClick(reply)" v-show="expanded||index<3">
				<y-button v-if="reply.createUserId === $env.userId.toString()" type="text" class="comment-delete" @click.native.stop="deleteReply(reply)">{{$R("delete")}}</y-button>
				<div class="reply-item-wrap">
					<span @click="toPersonallInfo(reply.createUserId)" v-text="reply.nickName" class="name"></span>
					<template v-if="reply.nickName">{{$R("comment-reply")}}
						<span @click="toPersonallInfo(reply.targetUserId)" v-text="reply.targetUserName" class="name"></span>
					</template>：{{ reply.comment }}
				</div>
			</li>
		</ol>
		<y-button v-if="overflow" size="s" v-text="toggleButtonText" :class="toggleButtonClass" @click.native.stop="toggle"></y-button>
	</div>
</template>

<script type="text/javascript">
import Button from '@/components/button';

let userIdFields = {
	'from': 'createUserId',
	'to': 'pId',
};

export default {
	name: 'y-reply-list',
	components: {
		[Button.name]: Button
	},
	props: {
		data: Array,
	},
	data() {
		return {
			expanded: false,
			disable: true
		};
	},
	computed: {
		overflow() {
			return this.data.length > 3;
		},
		toggleButtonText() {
			return this.expanded ? this.$R("pack-up") : this.$R("pack-down");
		},
		toggleButtonClass() {
			return { 'reply-list-toggle': !this.expanded, 'reply-expanded': this.expanded }
		}
	},
	methods: {
		toPersonallInfo(userId) {
			this.$yryz.toPersonalInfo({ userId: userId })
		},
		async deleteReply(reply) {
			if (this.disable) {
				this.disable = false;
				let res = await this.$http({
					method: 'DELETE',
					url: `/services/app/v1/comment/single/${reply.id}`
				});
				if (res.data.code === "200") {
					this.disable = true;
					this.data.splice(this.data.indexOf(reply), 1);
				} else {
					this.disable = true;
				}
			}
		},

		toggle() {
			this.expanded = !this.expanded;
		},

		getLink(id) {
			return this.$utils.getModule('0021').link.replace(':id', id);
		},

		handleClick(reply) {
			this.$eventBus.$emit('targetComment', reply);
		}
	}
};
</script>

<style type="text/css">
@import '#/css/var.css';
.reply-item-wrap .name {
	color: var(--theme-color);
}

.replies {
	@apply --border-top;
	margin-top: 0.2rem;
}

.reply-list {
	font-size: .28rem;
	margin: 0.13rem 0;
	color: var(--text-primary-color);
}

.reply-overflow {
	& .reply-list {
		box-sizing: content-box;
		max-height: 1.32rem;
		overflow: hidden;
	}
}

.reply-item {
	&:not(:first-child) {
		margin-top: 0.06rem;
	}
}

.reply-list-toggle,
.reply-expanded {
	position: relative;
	left: -0.44rem;
	height: 18px;
	line-height: 18px;
	color: var(--text-assist-color);
	background: var(--bg-color);
	padding: 0 .35em;
	margin: 0.2rem auto 0;
	font-size: .26rem;

	&:active {
		background: var(--bg-color);
	}

	&::after {
		content: "";
		display: inline-block;
		width: 0.17rem;
		height: 100%;
		background: url(../../assets/arrw_b01@2x.png) no-repeat;
		background-size: contain;
		background-position: center;
		float: right;
		margin-left: 0.06rem;
	}
}

.reply-expanded::after {
	transform: rotate(0.5turn);
}
</style>
