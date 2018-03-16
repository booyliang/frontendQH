<template>
	<div class="horoscope-wrap">
		<y-nav :title="$R('horoscope')" :showSearch="true" :menuData="menuData"></y-nav>
		<ul>
			<li v-for="(item,index) of constList" :key="index">
				<img class="const-icon" :src="item.imgUrl" alt="" @click="toDetail(item.id)">
				<p v-text="item.consName" class="const-name"></p>
				<p v-text="item.comstellationDate" class="const-date"></p>
			</li>
		</ul>
	</div>
</template>

<script>
import { YNav } from '@/components/nav';
import Button from '@/components/button';
export default {
	components: {
		YNav,
		[Button.name]: Button
	},
	data() {
		return {
			menuData: ['index'],
			constList: [],
		}
	},

	created() {
		this.$http.get('/services/app/v1/constellation/list')
			.then(res => {
				if (res.data.code === '200') {
					this.constList = res.data.data;
				}
			})
	},

	methods: {
		toDetail(id) {
			this.$router.push({ path: `/horoscope/detail/${id}` });
		}
	}
}
</script>

<style>
@import '#/css/var.css';
.horoscope-wrap {
	background: #fff;
	& ul {
		display: flex;
		flex-wrap: wrap;
		padding: 0.25rem 0.1rem;
		background: #fff;
		& li {
			width: 33.3%;
			text-align: center;
			padding: 0.25rem;

			& .const-icon {
				width: 1.5rem;
				height: 1.5rem;
				background-size: contain;
				margin: 0 auto;
			}

			& .const-name {
				color: var(--theme-color);
				font-size: 17px;
				margin-top: 0.1rem;
			}

			& .const-date {
				font-size: 14px;
				color: var(--text-secondary-color);
			}
		}
	}
}
</style>