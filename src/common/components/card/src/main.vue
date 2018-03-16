/**
*	Author: yefan
*
*/
<template>
	<div class="y_card" :class="{'y_card--vertical': this.position === 'vertical'}">
		<y-avatar v-bind="props" @click-avatar="handleClickAvatar" :class="imgClassName"></y-avatar>
		<div class="y_card-text">
			<h4 @click.stop="handleClick" class="y_card-title" v-text="title" v-if="title"></h4>
			<slot name="assist">
				<p class="y_card-assist" v-text="assist" v-if="assist"></p>
			</slot>
			<!--修改人：胡亮  修改原因：话题详情头像区域需要扩展“讨论”和“浏览”-->
			<slot></slot>
		</div>
	</div>
</template>
<script>
import YAvatar from '@/components/avatar'
import routerLinkMixin from '@/mixins/router-link'
export default {
	name: 'y-card',
	components: {
		YAvatar
	},
	mixins: [routerLinkMixin],
	props: {
		...YAvatar.props,
		title: String,
		assist: String,
		position: {
			type: String,
			default: 'horizontal'
		},

	},
	data() {
		return {
			tagName: this.to && this.$env.userId ? 'router-link' : 'h4',
		};
	},
	watch: {
		to() {
			this.tagName = this.to && this.$env.userId ? 'router-link' : 'h4';
		}
	},
	computed: {
		'props'() {
			var result = {};
			for (var key in this.$options.props) {
				result[key] = this[key];
			}
			let routerProps = this.$env.userId ? this.routerLinkProps : {};

			if (!this.$env.userId) {
				result.to = '';
			}
			return Object.assign(routerProps, result);
		},
		'imgClassName'() {
			let result = 'y_card-img';
			result = this.imgSize ? result + '__' + this.imgSize : result;
			return result;
		}
	},
	methods: {
		handleClickAvatar(data) {
			// if (!this.$env.custId) {
			// 	return false;
			// }
			if (this.to) {
				this.$router.push(this.to);
			} else {
				this.$emit('click-img', data);
			}
		},
		handleClick(event) {
			event.preventDefault();
			// if (!this.$env.userId) {
			// 	return false;
			// }
			if (this.to) {
				this.$router.push(this.to);
				return false;
			}
			this.$emit('click-name');
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.y_card {
	display: flex;
	align-items: center;
	& .y_avatar {
		width: 0.68rem;
		flex: 0 0 0.68rem;
		height: 0.68rem;
		margin-right: .1rem;
		&.y_card-img__large {
			width: 1.2rem;
			height: 1.2rem;
			flex: 0 0 1.2rem;
		}
	}
}

.y_card-text {
	flex: 0 0 auto;
}

.y_card-title {
	line-height: 1;
	font-size: .28rem;
	color: var(--active-color);
	&:not(:last-child) {
		margin-bottom: 0.03rem;
	}
}

.y_card-assist {
	font-size: .24rem;
	color: var(--text-assist-color);
}

.y_card--vertical {
	flex-direction: column;
	& .y_avatar {
		margin: 0 auto 0.1rem;
	}
	& .y_card-text {
		text-align: center;
		line-height: var(--default-line-height);
	}
}
</style>
