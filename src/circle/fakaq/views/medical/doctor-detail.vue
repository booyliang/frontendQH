<template>
	<div class="doctor-detail-wrap">
		<div class="detail-head">
			<y-nav :title="$R('doctor-detail')" :transparent="true"></y-nav>
			<y-card :src="data.doctorImg" :title="showName" :assist="address" img-size="large" position="vertical">
				<div v-if="data.hospitalName" v-text="data.hospitalName" @click="goHospital"></div>
			</y-card>
		</div>
	
		<y-panel :title="$R('skilled')" icon="iconfont icon-star-circle-b">
			<div v-text="data.doctorSkill"></div>
		</y-panel>
		<y-panel :title="$R('personal-profile')" icon="iconfont icon-intr" class="profile-wrap">
			<div v-text="data.doctorIntro"></div>
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
		this.$http.get(`/services/app/v1/doctor/single/${this.$route.params.id}`).then(res => {
			if (res.data.code === "200") {
				let _data = res.data.data;
				this.data = _data;
			}
		})
	},

	computed: {
		address() {
			return this.data.province + ' ' + this.data.city;
		},
		showName() {
			return this.data.doctorName + (this.data.doctorTitle ? ' ' + this.data.doctorTitle : '');
		},
	},
	methods: {
		goHospital() {
			this.$router.push({ path: `/hospital/detail/${this.data.hospitalId}` })
		}
	}
}
</script>
<style>
@import '#css/var.css';
.doctor-detail-wrap {
	& .detail-head {
		background-image: url(../../assets/fakaq-homepage@2x.png);
		background-repeat: no-repeat;
		background-size: 100% 4.15rem;
		background-color: #fff;

		& .y_card--vertical {
			padding-bottom: .15rem;
			& .y_card-text {
				color: #fff;
				& .y_card-title {
					color: #fff;
					font-size: 17px;
				}
				& .y_card-assist {
					color: #fff;
					font-size: 15px;
				}
			}
		}
	}

	& .panel {
		& .panel-head {
			& .panel-title {
				& .iconfont {
					color: var(--theme-color);
				}
			}
		}
	}
	& .profile-wrap {
		margin-bottom: 0;
	}
}
</style>


