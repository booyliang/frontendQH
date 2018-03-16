<template>
	<div class="garden_list">
		<y-nav title="秘密花园" class="nav-demo-b" :showSearch="true"  :menuData="['index']" :transparent="true">
		</y-nav>
		<div class="garden_header">
			<div class="garden_header-text">
				有些话，有些事，对谁也不曾提起 忍的辛苦，就不用忍了。 放空自己，继续前行
			</div>
		</div>
		<div class="garden_body">
			<y-load-more-remote :request="request" @loaded="handleLoaded">
				<!--<ul>
					<li v-for="(item, index) of gardenList" :key="index" v-text="item"></li>
				</ul>-->
				<router-link :to="item.detail" tag="div" class="garden_item" v-for="(item, index) of gardenList" :key="index">
					<div class="garden_item-badge"></div>
					<div class="garden_item-title">{{item.title}}</div>
					<div class="garden_item-footer"><span class="iconfont icon-heart"></span>{{$R('garden-feeling')}} {{item.count}}</div>
				</router-link>
			</y-load-more-remote>
		</div>
	</div>
</template>
<script>
	import { YNav, YNavSearch, YNavToggle } from '@/components/nav'
	import YButton from '@/components/button'
	import YLoadMoreRemote from '@/components/load-more-remote'
	export default {
		components: {
			YNav, YNavSearch, YNavToggle, YButton, YLoadMoreRemote
		},
		data() {
			return {
				request: {
					url: '/services/app/v1/question/list',
					params: {
						pageSize: 20,
					}
				},
				gardenList: [{
					title: '我知道他爱我12年了，高中时不懂，没和他在一起，但是暧昧了一段',
					count: '23',
					detail: 'detail/1'
				},
				{
					title: '我知道他爱我12年了，高中时不懂，没和他在一起，但是暧昧了一段',
					count: '23',
					detail: 'detail/2'
				},
				{
					title: '我知道他爱我12年了，高中时不懂，没和他在一起，但是暧昧了一段',
					count: '23',
					detail: 'detail/3'
				}],
			}
		},
		methods: {
			getGardenList() {
				this.$http.get('/services/app/v1/garden/detail');
			},
			handleLoaded(list, res) {
				// this.gardenList.push(...list);

			}
			
		},
		created() {
		}
	}

</script>
<style>
@import '#/css/var.css';
.garden_list{
	& .garden_header{
		background-image: url('../../assets/nx-head-bg@2x.jpg');
		height: 3.84rem;
		background-size: cover;
		margin-top: -1.28rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	& .garden_header-text{
		color: #fff;
		font-size: 17px;
		width: 5.1rem;
		margin-top: 0.6rem;
		text-align: center;
	}
	& .garden_body{
		padding: 0.4rem 0.3rem;
		& .garden_item{
			background: #fff;
			font-size: 18px;
			margin-bottom: 0.9rem;
			& .garden_item-badge{
				position: relative;
				top: -0.55rem;
				left: 44%;
				width: 1rem;
				height: 1rem;
				background: #fff;
				border-radius: 1rem;
				padding: 0.1rem;
				&::before{
					content: '';
					background-image: url(../../assets/nx-female@2x.png);
					background-size: cover;
					width: 0.8rem;
					height: 0.8rem;
					display: inline-block;
				}
			}
			& .garden_item-title{
				@apply --border-bottom;
				text-align: center;
				display: flex;
				padding: 0 0.34rem 0.5rem;
				margin-top: -0.15rem;
			}
			& .garden_item-footer{
				padding: 0.2rem;
				display: flex;
				justify-content: flex-end;
				font-size: 14px;
				color: #fb6b90;
				& .iconfont {
					margin-right: 0.1rem;
				}
			}
		}
	}
	
}
 
	
</style>