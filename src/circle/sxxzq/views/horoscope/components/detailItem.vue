<template>
	<div class="detail-container">
		<div v-if="tabId===0 || tabId===1">
			<div>
				<span class="first-key" v-text="$R('compositeIndex')"></span>
				<span v-text="data.compositeIndex"></span>
			</div>
			<div>
				<span class="first-key" v-text="$R('luckyColor')"></span>
				<span v-text="data.luckyColor"></span>
			</div>
			<div>
				<span class="first-key" v-text="$R('loveIndex')"></span>
				<span v-text="data.loveIndex"></span>
			</div>
			<div>
				<span class="first-key" v-text="$R('moneyIndex')"></span>
				<span v-text="data.moneyIndex"></span>
			</div>
			<div>
				<span class="first-key" v-text="$R('luckyNumber')"></span>
				<span v-text="data.luckyNumber"></span>
			</div>
			<div>
				<span class="first-key" v-text="$R('friend')"></span>
				<span v-text="data.friend"></span>
			</div>
			<div>
				<span class="first-key" v-text="$R('wholeFortune')"></span>
				<span v-text="data.wholeFortune"></span>
			</div>
		</div>
		<div v-else-if="tabId===2 || tabId===3|| tabId===4">
			<div>
				<span class="first-key" v-text="$R('health')"></span>
				<span v-text="data.health"></span>
			</div>
			<div>
				<span class="first-key">{{tabId===4?$R('love'):$R('llove')}}</span>
				<span v-text="data.love"></span>
			</div>
			<div>
				<span class="first-key" v-text="$R('money')"></span>
				<span v-text="data.money"></span>
			</div>
			<div>
				<span class="first-key" v-text="$R('workInfo')"></span>
				<span v-text="data.workInfo"></span>
			</div>
		</div>
		<div v-else>
			<div>
				<span class="first-key" v-text="$R('yearMima')"></span>
				<span v-for="(item,index) of data.yearMimas" v-text="item" :key="index" class="yearMima"></span>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'y-detail-item',
	props: {
		data: {
			required: true,
			type: Object
		},
		tabId: {
			required: true,
			type: Number
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.detail-container {
	padding: 0.2rem 0.3rem;
	& div {
		line-height: 0.56rem;
		font-size: 17px;
		color: var(--text-primary-color);
		& .first-key {
			color: var(--theme-color);
		}

		& .yearMima {
			/*text-indent: 0.6rem;*/
		}
	}
}
</style>


