<template>
	<div class="coterie-member-item" @click="toCoterie(data.coterieId)">
		<img :src="data.icon" alt="">
		<div class="coterie-member-item--right">
			<h3 class="coterie-member-item-title" v-html="name">
				<span class="iconfont icon-arrow-right item-arrow"></span>
			</h3>
			<div class="coterie-member-item-msg">
				<!-- <span v-html="ownerName"></span> -->
				<span v-html="intro"></span>
			</div>

			<div class="coterie-member-item-members">
				<span>{{data.memberNum}}人加入</span>
				<span class="coterie-member-item-members--free coterie-member-item-members--box" v-if="data.joinFee===0">免费</span>
				<span class="coterie-member-item-members--notfree coterie-member-item-members--box" v-if="data.joinFee!==0">{{data.joinFee | priceUnit}}悠然币</span>
			</div>
		</div>
	</div>
</template>
<script>
import List from '@/components/list';
import Item from '@/components/item';
import Card from '@/components/card';
import Button from '@/components/button';
import Toast from '@/components/toast';
import LoadMoreRemote from '@/components/load-more-remote';
import { YNav } from '@/components/nav';
import YNavSearch from '@/components/nav/nav-search';
export default {
	components: {
		[List.name]: List,
		[Item.name]: Item,
		'y-card': Card,
		[Button.name]: Button,
		[LoadMoreRemote.name]: LoadMoreRemote,
	},
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	computed: {
		name() {
			let reg = RegExp(this.replaceData, 'g');
			return this.data.name.replace(reg, `<span class='search-color'>${this.replaceData}</span>`)
		},
		ownerName() {
			let reg = RegExp(this.replaceData, 'g');
			return this.data.ownerName.replace(reg, `<span class='search-color'>${this.replaceData}</span>`)
		},
		intro() {
			let reg = RegExp(this.replaceData, 'g');
			return this.data.intro.replace(reg, `<span class='search-color'>${this.replaceData}</span>`)
		},
	},
	data() {
		return {
			replaceData: this.$route.query.keyword.replace(/\\/g, '').replace(/\//g, ''),
		}
	},
	methods: {
		toCoterie(id) {
			this.$router.push(`/coterie/${id}`)
		}
	}
}

</script>
<style>
@import "#/css/var.css";
.coterie-member-list {
	background: #fff;
	color: var(--text-primary-color);
}

.coterie-member-item {
	display: flex;
	padding: 0.3rem;
	border-bottom: 1px solid #eee;
	& .coterie-member-item--right {
		flex-grow: 1;
		white-space: nowrap;
		overflow: hidden;
		/* text-overflow: ellipsis; */
	}
	& .coterie-member-item-title {
		font-size: .38rem;
		font-weight: 600;
		line-height: 1.2;
		margin-bottom: 0.15rem;
	}
	& .icon-arrow-right {
		float: right;
		& .icon-arrow-right:before {
			content: "\E62D";
		}
	}
	& .coterie-member-item-msg {
		color: #7e7e7e;
		font-size: .3rem;
		margin-bottom: 0.1rem;
		/* white-space: nowrap; */
		overflow: hidden;
		text-overflow: ellipsis;
	}
	& .coterie-member-item-members {
		color: #7e7e7e;
		font-size: .24rem;
	}
	& .coterie-member-item-members--box {
		float: right;
		font-size: .3rem;
	}
	& .coterie-member-item-members--free {
		color: #4da9ff;
	}
	& .coterie-member-item-members--notfree {
		color: #f5cd45;
	}
	& img {
		flex: 0 0 auto;
		width: 1.4rem;
		height: 1.4rem;
		border-radius: 0.1rem;

		margin-right: 0.2rem;
	}
}
</style>