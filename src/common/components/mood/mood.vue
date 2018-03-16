/**
*	Author: aiqingmin
*
*/
<template>
	<div class="mood" v-if="moods.length > 0 && showMood">
		<div class="mood_title">{{title || $R('mood-title')}}</div>
		<div class="mood_body">
			<div class="mood-item" v-for="item in moods">
				<y-button class="mood-item-img" :style="{backgroundImage: `url(${item.imgUrl})`}" type="text" :disabled="!!moodJoinStatus" @click.native="chooseMood(item)"></y-button>
				<div :class="['mood-count', {'mood-active': item.joinStatus}]" v-if="moodJoinStatus">{{item.joinCount}}</div>
				<div :class="['mood-label', {'mood-active': item.joinStatus}]" >{{item.description}}</div>
			</div>
		</div>
	</div>
</template>
<script>
	import Toast from '@/components/toast'
	export default {
		components: {
			Toast
		},
		props: {
			title: String,
			data: Object,
		},
		data() {
			return {
				moodJoinStatus: 0,
				moods: []
			}
			
		},
		computed: {
			showMood() {
				return this.$env.userId;
			}
		},
		watch: {
			data() {
				this.getMoods();
			}
		},
		created() {
			this.getMoods();
		},
		methods: {
			async getMoods() {
				if (!this.data || !this.data.id || !this.data.moduleEnum || !(this.data.moodFlag === 1)) {
					return;
				}
				let res = await this.$http.get(`/services/app/v1/mood/detail/${this.data.moduleEnum}/${this.data.id}`);
				if (!res.data.data) {
					return;
				}
				this.moods = res.data.data.moods;
				this.moodJoinStatus = res.data.data.moodJoinStatus;
			},
			chooseMood(item) {
				if (!this.data || !this.data.id || !this.data.moduleEnum) {
					return;
				}
				this.$http.post(`/services/app/v1/mood/participator/${this.data.moduleEnum}/${this.data.id}/${item.id}`).then((res) => {
					if (res.data.code === "200") {
						this.moodJoinStatus = 1;
						item.joinCount += 1;
						item.joinStatus = 1;
						return;
					}
					Toast(this.$R('toast-req-failed'));
				}).catch(msg => {
					Toast(this.$R('toast-req-failed'));
				});
			}
		}
	}
</script>
<style>
@import '#/css/var.css';
	.mood {
		background: #fff;
		padding: 0.47rem 0.15rem;
			
		& .mood_title {
			font-size: var(--default-font-size);
			color: #333;
			text-align: center;
		}
		& .mood_body {
			margin-top: 0.4rem;
			display: flex;
			justify-content: space-around;
			& .mood-item {
				text-align: center;
				font-size: .28rem;
				& .mood-item-img {
					width: 1.4rem;
					height: 1.4rem;
					background-repeat: no-repeat;
					background-position: center;
					background-size: contain;
					padding: 0;
				}
			}
			& .mood-active {
				color: #fb6b90;
			}
		}
	}

</style>