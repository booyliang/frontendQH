<template>
	<div class="medical-item-wrap">
		<template v-if="tabId === 'doctor'">
			<y-item :to="link">
				<y-card :src="data.doctorImg" :title="data.doctorName" :assist="introduce" img-size="large" :to="link">
					<div v-text="label"></div>
				</y-card>
			</y-item>
		</template>
		<template v-else>
			<y-item :to="link">
				<div class="flow_item-cover">
					<img v-if="data.hospitalImg" :src="data.hospitalImg | imageResize(1)" class="flow_item-thumb">
					<div class="float-right">
						<div v-if="data.hospitalName" class="flow_item-title" v-text="data.hospitalName"></div>
						<div class="align-bottom">
							<div v-if="data.hospitalPhone" class="medical-phone">
								<span>{{ $R('hospital-phone') + '：'}}</span>
								<span v-text="data.hospitalPhone" class="phone"></span>
							</div>
							<div v-if="data.province && data.city" class="medical-area" v-text="data.province+' '+data.city"></div>
						</div>
					</div>
				</div>
			</y-item>
		</template>
	</div>
</template>

<script>
import Card from '@/components/card'
import Item from '@/components/item'
export default {
	name: 'y-medical-item',
	components: {
		[Card.name]: Card,
		[Item.name]: Item,
	},
	props: {
		data: {
			type: Object,
			required: true,
		},
		tabId: {
			type: [Number, String]
		}
	},
	computed: {
		introduce() {
			if (!this.data.doctorTitle) {
				return `${this.data.province} ${this.data.city}`
			} else {
				return `${this.data.doctorTitle} / ${this.data.province} ${this.data.city}`
			}
		},
		label() {
			return `${this.$R('skilled')}：${this.data.doctorSkill.replace(/,|，/g, ' / ')}`
		},
		link() {
			return `${this.tabId === 'doctor' ? '/doctor' : '/hospital'}/detail/${this.data.id} `;
		}
	},
	methods: {
	}
}
</script>

<style>
@import '#/css/var.css';
.medical-item-wrap {
	padding: 0 .15rem;
	& .item--clickable {
		padding: 0;
	}
	& .item {
		& .item-wrap {
			@apply --border-bottom;
			display: block;

			& .y_card {
				& .y_card-text {
					& .y_card-title {
						font-size: 17px;
					}
					& div {
						margin-top: 6px;
					}
				}
				& .y_card-assist {
					margin-top: 2px;
				}
			}

			& .flow_item-cover {
				/* position: relative; */
				& .float-right {
					& .align-bottom {
						font-size: 15px;

						& .medical-phone {
							color: #666;
							& .phone {
								color: var(--theme-color);
							}
						}
					}
				}
			}
		}
	}
}
</style>


