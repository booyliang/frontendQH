<template>
	<span class="countDown">
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
		// this.count = (new Date(this.endDate) - new Date(this.nowDate)) / 1000;
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
				this.count = this.count - 1;
				if (this.count <= 0) {
					this.countdownEnd();
				}
			}, 1000)
		},

		updateTime() {
			let day = parseInt(this.count / (60 * 60 * 24)) + '';
			if (day.length === 1) day = '0' + day;
			this.day = day;

			let hour = Math.trunc(this.count / (60 * 60)) % 24 + '';
			if (hour.length === 1) hour = '0' + hour;
			this.hour = hour;

			let minute = Math.trunc(this.count / 60) % 60 + '';
			if (minute.length === 1) minute = '0' + minute;
			this.minute = minute;

			let second = Math.trunc(this.count) % 60 + '';
			if (second.length === 1) second = '0' + second;
			this.second = second;
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
 .countDown {
	text-align: right;
	& span {
		color: #fff;
		font-size: .26rem;
	}
	& .timeNum {
		background: rgba(0, 0, 0, .5);
		border-radius: 4px;
		padding: .02rem .04rem;
		width: auto;
		height: .4rem;
		line-height: .4rem;
		text-align: center;
		display: inline-block;
	}
} 
</style>
