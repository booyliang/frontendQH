<template>
	<div class="rank-item">
		<div class="number">
			{{ rank }}
		</div>
		<y-card :to="`/user/${itemData.userId}`" :title="itemData.nickName" :src="itemData.userImg"></y-card>
		<div class="like-count">
			{{ itemData.likeCount | count }}
		</div>
	</div>
</template>
<script>
	import YCard from '@/components/card'
	export default {
		name: 'y-rank-item',
		components: {
			YCard
		},
		filters: {
			'count': function (value) {
				if (parseInt(value) > 9999) {
					return (value / 10000).toFixed(2) + '万'
				} else {
					return value;
				}
			}
		},
		props: {
			itemData: Object,
			rank: Number
		}
	}
</script>
<style>
	 @import "#/css/var.css";
	.rank-item {
		@apply --display-flex;
		justify-content: space-around;
		&:first-child {
			border-top: .01rem solid #dff2f9;
		}
		border-bottom: .01rem solid #dff2f9;
		padding: .2rem 0;

		& .y_card-title {
			color: var(--active-color);
			display: inline-block;
			width: 3rem; 
			@apply --text-cut;
			-webkit-line-clamp: 1;
            
		}

		&:first-child , &:nth-child(2), &:nth-child(3) {
			& .like-count {
				color: var(--assist-color);
			}
			& .number {
	            width: .54rem;
				height: .54rem;
				background-image: url(../assets/cup-gold@2x.png);
				background-repeat: no-repeat;
				background-size: cover;
				text-indent: -9999rem;
			}
		}

		&:nth-child(2) .number {
			background-image: url(../assets/cup-silver@2x.png);

		}
		&:nth-child(3) .number {
			background-image: url(../assets/cup-copper@2x.png);

		}

		& .number {
			width: .6rem;
			text-align: center;
		}
		& .like-count {
			width: .9rem;
		}
	}
</style>
