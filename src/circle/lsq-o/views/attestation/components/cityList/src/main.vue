<template>
	<div class="city-list">
		<div class="province-name">
			<ul>
				<li class="item-p first-name" @click="selectProvince(null)">{{$R('nationwide')}}</li>
				<li v-for="(item,index) of data" class="item-p" @click="selectProvince(index)" :class="currentIndex === index?'active':''">{{item.classification}}</li>
			</ul>
		</div>
		<div class="city-name" v-if="isShowChildList">
			<ul>
				<li v-text="currentCity" class="item-c first-name"></li>
				<li v-for="(item,index) of childData" class="item-c" @click="selectCity(index)">{{item.designation}}</li>
			</ul>
		</div>
	</div>
</template>
<script>
export default {
	name: 'y-city-list',
	components: {},
	props: {
		data: {
			type: Array,
			require: true
		}
	},
	data() {
		return {
			isShowChildList: false,
			currentIndex: null,
		}
	},
	computed: {
		currentCity() {
			return `${this.$R('full')}${this.data[this.currentIndex].classification}`;
		},
		childData() {
			return this.data[this.currentIndex].child;
		}
	},

	methods: {
		selectProvince(index) {
			if (index === null) {
				this.currentIndex = null;
				this.isShowChildList = false;
				this.$emit('select', null);
				return false;
			}
			this.isShowChildList = true;
			this.currentIndex = index;
		},
		selectCity(index) {
			this.isShowChildList = false;
			this.$emit('select', this.data[this.currentIndex].classification, this.data[this.currentIndex].child[index].designation);
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.city-list {
	display: flex;
	flex-wrap: wrap;
	width: 100%;

	& .province-name {
		width: 40%;
		& ul {
			height: 8rem;
			overflow-y: auto;
			background: #F8F8F8;
			& .item-p {
				line-height: 0.8rem;
				border-bottom: 0.01rem solid #E7E7E7;
				font-size: 15px;
				padding: 0 0.2rem;
				/*background: #F8F8F8;*/
			}
			& .first-name {
				/*font-weight: bold;*/
				color: #999;
			}
			& .active {
				background: #fff;
				color: #DC8130;
				border-left: 6px solid #DC8130;
			}
		}
	}

	& .city-name {
		width: 60%;
		& ul {
			height: 8rem;
			overflow-y: auto;
			background: #fff;
			& .item-c {
				line-height: 0.8rem;
				border-bottom: 0.01rem solid #E7E7E7;
				font-size: 15px;
				padding: 0 0.2rem;
				/*background: #fff;*/
			}
			& .first-name {
				/*font-weight: bold;*/
				color: #999;
			}
		}
	}
}
</style>
