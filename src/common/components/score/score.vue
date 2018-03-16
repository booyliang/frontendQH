/**
*	Author: yulan
*
*/
<template>
	<div class="starScore" :class="classList" @click="handerScore"></div>
</template>

<script>
export default {
	name: 'score',
	data() {
		return {
			starNum: this.scoreNum
		}
	},
	props: {
		scoreNum: Number
	},
	mounted() {
		this.starNum = this.scoreNum === null ? 0 : this.scoreNum;
	},
	watch: {
		scoreNum(val) {
			this.starNum = this.scoreNum;
		}
	},
	computed: {
		classList() {
			return 'start' + this.starNum
		}
	},
	methods: {
		handerScore(event) {
			event = event || window.event;
			let target = event.target;
			let len = event.pageX - target.getBoundingClientRect().left;
			let score = Math.round((len / target.offsetWidth) * 100);
			console.log(score)
			if ( score > 0 && score <= 20 ) {
				this.starNum = 2;
			}
			if ( score > 20 && score <= 40) {
				this.starNum = 4;
				
			} 
			if ( score > 40 && score <= 60) {
				this.starNum = 6;
				
			} 
			if ( score > 60 && score <= 80) {
				this.starNum = 8;
				
			}
			if ( score > 80 && score <= 100) {
				this.starNum = 10;
				
			}
			this.$emit("updataScore", this.starNum);
			
		}
	},


}

</script>

<style>
@import "#/css/var.css";
.starScore {
	position: relative;
	width: 4.2rem;
	height:.54rem;
	margin: 10px auto;
	&:--before-after {
		position: absolute;
		top:0;
		left:0;
		content: "";
		width:100%;
		height: 100%;
		background:url("./star_off.png") repeat-x;
		background-size: auto 100%;

	}
	&:after{
		width:0;
		background:url("./star_on.png") repeat-x;
		background-size: auto 100%;
	}

}
.starScore.start0{
	&:after{
		width: 0;
	}
} 
.starScore.start1{
	&:after{
		width: 10%;
	}
} 
.starScore.start2{
	&:after{
		width: 20%;
	}
} 
.starScore.start3{
	&:after{
		width: 30%;
	}
}
.starScore.start4{
	&:after{
		width: 40%;
	}
} 
.starScore.start5{
	&:after{
		width: 50%;
	}
}
.starScore.start6{
	&:after{
		width: 60%;
	}
}
.starScore.start7{
	&:after{
		width: 70%;
	}
}
.starScore.start8{
	&:after{
		width: 80%;
	}
}
.starScore.start9{
	&:after{
		width: 90%;
	}
}
.starScore.start10{
	&:after{
		width: 100%;
	}
}
</style>