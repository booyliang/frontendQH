<template>
	<span class="platform-activity-countDown">
		<span class="timeNum">{{day}}</span>
		<span class="timeText" v-text="$R('day')"></span>
		<span class="timeNum">{{hour}}</span>
		<span class="timeText" v-text="$R('hours')"></span>
		<span class="timeNum">{{minute}}</span>
		<span class="timeText" v-text="$R('minutes')"></span>
		<span class="timeNum">{{second}}</span>
		<span class="timeText" v-text="$R('seconds')"></span>
	</span>
</template>
<script type="text/javascript">
export default {
	name: 'y-count-down',
	props: {
		nowDate: String,
		endDate: String
	},
	data() {
		return {
			day: '0',
			hour: '0',
			minute: '0',
			second: '0',
			count: 0,
			isStart: false,
			interval: null
		}
	},
	watch: {
		count() {
			this.updateTime();
		}
	},

	created() {
		if (!this.endDate || !this.nowDate) {
			console.error('time format parse error.');
			return false;
		}
		let dateArr = this.endDate.split(/[- :]/);
		const endDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], dateArr[3], dateArr[4], dateArr[5]);
		dateArr = this.nowDate.split(/[- :]/);
		const nowDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], dateArr[3], dateArr[4], dateArr[5]);
		this.count = (endDate - nowDate) / 1000;
	},
	mounted() {
		!this.isStart && this.start();
	},
	methods: {
		start() {
			this.isStart = !this.isStart;
			this.interval = setInterval(() => {
				if (this.count <= 0) {
					this.countdownEnd();
				}
				if (this.count > 0) {
					this.count -= 1;
				}
			}, 1000)
		},
		updateTime() {
			this.day = (Math.trunc(this.count / (60 * 60 * 24))).toString().padStart(2, '0');
			this.hour = (Math.trunc(this.count / (60 * 60)) % 24).toString().padStart(2, '0');
			this.minute = (Math.trunc(this.count / 60) % 60).toString().padStart(2, '0');
			this.second = (Math.trunc(this.count) % 60).toString().padStart(2, '0');
		},
		countdownEnd() {
			clearInterval(this.interval);
			this.isStart = false;
			this.$emit('countdown_end');
		},
	},

	beforeDestroy() {
		clearInterval(this.interval);
	}
}
</script>
<style>
@import "#/css/var.css";
 .platform-activity-countDown {
	text-align: right;
	& span {
		color: #fff;
		font-size: .28rem;
	}
	& .timeNum {
		background: rgba(0, 0, 0, 1);
		border-radius: 4px;
		width: auto;
		height: .4rem;
		line-height: .4rem;
		text-align: center;
		display: inline-block;
	}
} 
</style>
