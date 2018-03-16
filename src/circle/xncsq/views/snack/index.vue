<template>
	<div class="snack">
		<y-nav :title="$R('snack-title')" :showSearch="true" :menuData="['copy-url', 'index']">
		</y-nav>
		<div class="snack-header">
			<div class="snack-today"><span class="snack-day">{{curDay}}</span>{{$R('day')}} {{curMonth}}{{$R('month')}}</div>
			<div class="snack-declar">{{chowhoundDeclar}}</div>
		</div>
		<div class="snack-body">
			<div class="snack-list" v-if="snackList && snackList.length">
				<div class="flow-item-snack" v-for="item in snackList">
					<router-link :to="`detail/${item.id}`">
						<div class="snack-item-wrap">
							<img :src="item.imgUrl | imageResize(6)" :alt="item.refName">
							<div class="snack-item-name">{{item.refName}}</div>
							<div class="snack-item-intro">
								{{item.breif}}
							</div>
						</div>
					</router-link>
				</div>
			</div>
			<div class="snack-empty" v-else>
				<div class="empty-img"></div>
				<p class="empty-content">{{$R('snack-no-reco')}}</p>
			</div>
			
		</div>
		
		<div class="snack-footer" v-if="snackList && snackList.length">
			<router-link to="all"><span>{{$R('read-all')}}</span></router-link>
		</div>
	</div>
</template>
<script>
import { YNav } from '@/components/nav'
import YItem from '@/components/item'
import YFlowList from '@/components/flow-list'
export default {
	components: {
		YNav,
		YItem
	},
	data() {
		return {
			chowhoundDeclar: '',
			today: '',
			snackList: []
		}
	},
	created() {
		this.getDailySnack();
	},
	methods: {
		getDailySnack() {
			this.$http.get('/services/app/v1/mrtj/getMrtj').then((res) => {
				if (res.data.code === '200') {
					let _res = res.data.data;
					this.snackList = _res.reflist;
					this.chowhoundDeclar = _res.declaration;
					this.today = _res.addTime && _res.addTime.split(' ')[0];
					for (let item of this.snackList) {
						let itemImg = JSON.parse(item.contentSource).find((cItem) => cItem.image).image;
						this.$set(item, 'imgUrl', itemImg);
					}
				}
			})
		}
	},
	computed: {
		curDay() {
			return this.today.split('-')[2];
		},
		curMonth() {
			return this.today.split('-')[1];
		}
	}
}
</script>
<style>
.snack {
	background: #F9F3E6;
	& .snack-header{
		background: url(../../assets/page-headbg@2x.jpg);
		background-size: cover;
		padding: 0.3rem 1rem 0.2rem 1.6rem;
		color: #945924;
		height: 2.5rem;
		& .snack-today{
			font-size: 18px;
		}
		& .snack-day{
			font-size: 36px;
		}
	}
	& .snack-empty{
		background: #fff;
		height: 72vh;
		padding-top: 1.8rem;
		border-top-left-radius: 0.1rem;
		border-top-right-radius: 0.1rem;
		& .empty-img{
			height: 2.4rem;
			width: 2.4rem;
			background-image: url(../../assets/no-content@2x.png);
			background-size: cover;
			margin: 0 auto;
		}
		& .empty-content{
			font-size: 16px;
			color: #999;
			text-align: center;
			margin-top: 0.5rem;
		}
	}
	& .snack-footer{
		text-align: center;
		font-size: 14px;
		color: #fca83d;
		padding-bottom: 0.5rem;
		line-height: 25px;
		& span{
			background: #F8F8F8;
			padding: 0.05rem 0.3rem;
			border-radius: 1rem;
		}
		
	}
	& .flow-item-snack{
		margin: 0.3rem;
		background: #fff;
		padding: 0.3rem;
		text-align: center;
		border-radius: 0.1rem;
		& .snack-item-wrap{
			& img{
				width: 100%;
				height: 3.68rem;
				display: block;
			}
			& .snack-item-name{
				font-size: 18px;
				line-height: 1;
				margin-top: 15px;
			}

			& .snack-item-intro {
				margin-top: 13px;
			}
			
		}
	}
}
</style>