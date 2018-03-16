<template>
	<div class="city-list">
		<div class="province-name">
			<ul>
				<li class="item-p first-name" @click="selectProvince(null)">{{$R('country')}}</li>
				<li v-for="(item,index) of data" class="item-p" @click="selectProvince(index)" :class="currentIndex === index?'active':''" :key="index">{{item.name}}</li>
			</ul>
		</div>
		<div class="city-name" v-if="isShowChildList">
			<ul>
				<li v-text="currentCity" class="item-c first-name"></li>
				<li v-for="(item,index) of childData" class="item-c" @click="selectCity(index)" :key="index">{{item.name}}</li>
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
			return `${this.$R('full')}${this.data[this.currentIndex].name}`;
		},
		childData() {
			return this.data[this.currentIndex].citys;
		}
	},

	methods: {
		selectProvince(index) {
			// console.log(index);
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
			this.$emit('select', this.data[this.currentIndex].name, this.data[this.currentIndex].citys[index].name);
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.item-data {
	position: relative;
}

.city-list {
	/*position: relative;*/
	width: 100%;
	display: flex;
	flex-wrap: wrap;

	& .province-name {
		position: absolute;
		width: 40%;
		& ul {
			overflow-y: auto;
			background: var(--bg-color);
			& .item-p {
				line-height: 44px;
				@apply --border-bottom;
				font-size: 16px;
				padding-left: 0.3rem;
			}
			& .active {
				background: #fff;
				color: #bb6101;
				border-left: 0.1rem solid #dc8130;
			}
		}
	}

	& .city-name {
		position: absolute;
		right: 0;
		width: 60%;
		& ul {
			overflow-y: auto;
			background: #fff;
			& .item-c {
				@apply --border-bottom;
				line-height: 44px;
				font-size: 16px;
				padding-left: 0.3rem;
			}
			& .first-name {
				color: #999;
			}
		}
	}
}
</style>
