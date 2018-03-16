<template>
	<y-item class="temporary_activity-search">
		<div slot="body">
			<span class="iconfont icon-search"></span>
			<y-input v-model="searchValue" type="number" :min="1" :maxlength="10" placeholder="请输入参赛编号" :show-text-length-info="false"></y-input>
			<span v-if="searchValue" @click="searchValue = '';" class="iconfont icon-close-a clear"></span>
		</div>
		<div slot="foot" class="search-button" @click="search">搜索</div>
	</y-item>
</template>
<script>
	export default {
		data() {
			return {
				searchValue: ''
			}
		},
		methods: {
			search() {
				this.$emit('search', this.searchValue);
			}
		}
	}
</script>

<style>
	@import "#/css/var.css";
	.temporary_activity-search {
		background: #F8F8F8;
		padding: 0 0.3rem;
		position: sticky;
		position: -webkit-sticky;
		top: 2.16rem;
		width: 100%;
		z-index: 9;
		& .item-wrap {
			padding: .2rem 0;
			border: none;
		}
		& .item-body {
			position: relative;
			background-color: #FFF;
			border-radius: .5rem;
			padding: 0 .3rem;
			margin-right: .4rem;

			&>div {
				display: flex;
				align-items: center;
				width: 50%;
				margin: auto;
			}

			& .icon-search {
				color: #aaa;
			}
			& .clear {
				font-size: 8px;
				color: #bfbfbf;
			}
			& .y-input {
				margin-left: .1rem;
				& input {
					font-size: .3rem;
					padding: 0.1rem 0;
				}
			}
		}
		& .item-foot {
			&>div {
				color: var(--theme-color);
				font-size: .3rem;
			}
		}
	}
</style>
