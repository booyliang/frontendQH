<template>
	<div class="hospital-detail-wrap">
		<y-nav :title="$R('hospital-detail')"></y-nav>
	
		<div v-if="data.hospitalImg" class="fm-img">
			<img :src="data.hospitalImg | imageResize(5)">
		</div>
	
		<y-item :title="data.hospitalName" vertical class="no-border-top">
			<div slot="body" v-if="data.hospitalLevel">
				<span class="level">{{$R('level') + '：'}}</span>
				<span v-text="data.hospitalLevel"></span>
			</div>
		</y-item>
	
		<y-item v-if="data.hospitalPhone">
			<div slot="head">
				<span class="iconfont icon-phone-b"></span>
				<span>{{$R('phone')}}</span>
			</div>
			<a slot="foot" :href="'tel:'+data.hospitalPhone" target="_blank">
				<span v-text="data.hospitalPhone"></span>
			</a>
		</y-item>
	
		<y-item v-if="getAddress" :value="getAddress" vertical>
			<div slot="head">
				<span class="iconfont icon-addr"></span>
				<span>{{$R('area')}}</span>
			</div>
		</y-item>
	
		<y-panel v-if="data.hospitalIntro" :title="$R('introduction')" icon="iconfont icon-intr">
			<div v-text="data.hospitalIntro"></div>
		</y-panel>
	
		<y-panel v-if="data.doctors && data.doctors.length" :title="$R('recommend-doctor')" icon="iconfont icon-doctor" class="recommend-wrap">
			<y-card v-for="(item, index) of data.doctors" :key="index" :src="item.doctorImg" :title="curStr(item.doctorName, 10)" position="vertical" :to="`/doctor/detail/${item.id}`"></y-card>
		</y-panel>
	</div>
</template>

<script>
import Card from '@/components/card'
import Item from '@/components/item'
import Panel from '@/components/panel'
export default {
	components: {
		[Card.name]: Card,
		[Item.name]: Item,
		[Panel.name]: Panel,
	},

	data() {
		return {
			data: {}
		}
	},
	created() {
		this.$http.get(`/services/app/v1/hospital/single/${this.$route.params.id}`).then(res => {
			if (res.data.code === "200") {
				let _data = res.data.data;
				this.data = _data;
			}
		})
	},

	computed: {
		getAddress() {
			return this.data.province + this.data.city + (this.data.location ? this.data.location : '');
		}
	},
	methods: {
		curStr(str, len) {
			let str_length = 0;
			let str_len = str.length;
			let str_cut = '';
			for (let i = 0; i < str_len; i++) {
				let a = str.charAt(i);
				str_length++;
				if (escape(a).length > 4) {
					// 中文字符的长度经编码之后大于4
					str_length++;
				}
				str_cut = str_cut.concat(a);
				if (str_length >= len) {
					str_cut = str_cut.concat("...");
					return str_cut;
				}
			}
			// 如果给定字符串小于指定长度，则返回源字符串；
			if (str_length < len) {
				return str;
			}
		},
		goDoctor(id) {
			this.$router.push({ path: `/doctor/detail/${id}` })
		},
	}
}
</script>
<style>
@import '#css/var.css';
.hospital-detail-wrap {
	& .fm-img {
		background: #fff;
	}
	& .item {
		& .item-wrap {
			& .item-head {
				& .iconfont {
					color: var(--theme-color);
				}
			}
			& .item-body {
				& .level {
					color: #666666;
				}
			}
			& .item-foot {
				& a {
					color: var(--theme-color);
				}
			}
		}
	}
	& .no-border-top {
		& .item-wrap {
			border-top: none;
		}
	}
	& .panel {
		margin-top: .2rem;
		margin-bottom: 0;
		& .panel-head {
			& .panel-title {
				& .iconfont {
					color: var(--theme-color);
				}
			}
		}
	}
	& .recommend-wrap {
		margin-bottom: 0;

		& .panel-body {
			display: flex;
			flex-wrap: wrap;

			& .y_card {
				width: 25%;
				margin-bottom: .3rem;
				& .y_avatar {
					margin-bottom: 0.15rem;
				}

				& .y_card-text {
					& .y_card-title {
						color: #000;
						@apply --text-cut;
					}
				}
			}
		}
	}
}
</style>


