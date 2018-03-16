<template>
	<div class="flow_item-celebrity">
		<y-card :to="`/user/${data.createUserId}`" img-size="large" :badge="true" :src="data.headImg">
			<div slot="assist" class="flow_list_count">
				<h4 @click="toMyhomepage">{{realName}}
					<label>{{occupation}}</label>
				</h4>
				<p>{{data.speciality.replace(/，/g, ' ').replace(/,/g, ' ')}}</p>
				<span>{{data.organization}}</span>
			</div>
		</y-card>
		<div class="flow_item-celebrity--call">
			<span>{{workCity}}</span>
			<y-button type="ghost" @click.native="ask" v-if="!data.currUserFlag">咨询TA</y-button>
		</div>
	
	</div>
</template>
<script>
import YCard from '@/components/card'
import YButton from '@/components/button'
export default {
	name: 'y-flow-item-celebrity',
	components: {
		YCard,
		YButton
	},
	props: {
		data: {
			type: Object,
			default: () => { return {} }
		}
	},
	computed: {
		// organization() { // 就职单位
		// 	if (this.data.organization.length <= 12) {
		// 		return this.data.organization
		// 	} else {
		// 		return this.data.organization.substring(0, 12) + '...'
		// 	}
		// },
		realName() {  // 姓名
			if (this.data.realName.length <= 4) {
				return this.data.realName
			} else {
				return this.data.realName.substring(0, 3) + '...'
			}
		},
		workCity() { // 城市
			if (this.data.workCity.length <= 5) {
				return this.data.workCity
			} else {
				return this.data.workCity.substring(0, 5) + '...'
			}
		},
		// speciality() { // 擅长领域
		// 	this.data.speciality = this.data.speciality.replace(/，/g, ',');
		// 	// console.log(this.data.speciality);
		// 	let strArray = this.data.speciality.split(',');
		// 	let result = '';
		// 	let maxLength = 12;
		// 	for (let i = 0; i < strArray.length; i++) {
		// 		// result = i === 0 ? strArray[i] : ' ' + strArray[i];
		// 		if (i !== 0) {
		// 			result += ' ';
		// 		}
		// 		result += strArray[i].substring(0, maxLength);
		// 		maxLength -= strArray[i].length;
		// 		if (maxLength <= 0) {
		// 			result += '...';
		// 			return result;
		// 		}
		// 	}
		// 	// console.log(result);
		// 	return result;
		// 	// if (this.data.speciality.length <= 12) {
		// 	// 	return this.data.speciality.replace(/,/g, ' ').replace(/，/g, ' ')
		// 	// } else {
		// 	// 	return this.data.speciality.replace(/,/g, ' ').replace(/，/g, ' ').substring(0, 12) + '...'
		// 	// }
		// },
		occupation() { // 职称
			if (this.data.occupation.length <= 6) {
				return this.data.occupation
			} else {
				return this.data.occupation.substring(0, 5) + '...'
			}
		}
	},
	methods: {
		toMyhomepage() {
			this.$router.push(`/user/${this.data.createUserId}`)
		},
		ask() {
			this.$http.get(`/services/app/v1/question/count/${this.data.createUserId}`).then(response => {
				let resData = response.data;
				if (resData.code === '200') {
					let data = resData.data;
					if (parseInt(data.flag) === 1) {
						this.$toast('一天之内只能向三个问答明星提问');
						return false;
					} else if (parseInt(data.flag) === 2) {
						this.$toast('您今天已经向TA提问3次啦，请换个问答明星提问吧！');
						return false;
					}
					this.$router.push(`/question/new/${this.data.createUserId}`);
				} else {
					this.$toast(resData.msg);
				}
			})

		}
	}
}
</script>
<style>
@import "#/css/var.css";
.flow_item-celebrity {

	& .y_card-title {
		margin-bottom: 0;
	}
	& .y_card-text {
		flex: 1;
	}
	& .flow_list_count {
		& h4 {
			font-size: 17px;
			color: var(--active-color);
			& label {
				margin-left: 0.18rem;
				font-size: 15px;
				color: var(--text-primary-color);
			}
		}
		& p {
			font-size: 13px;
			color: var(--text-assist-color);
			margin-bottom: .15rem;
			@apply --text-cut-multi-line;
			-webkit-line-clamp: 1;
		}
		& span {
			font-size: 14px;
			color: var(--text-primary-color);
			@apply --text-cut-multi-line;
			-webkit-line-clamp: 1;
		}
	}

	& .flow_item-celebrity--call {
		& span {
			font-size: 13px;
			color: var(--text-assist-color);
			display: block;
			text-align: center;
			@apply --text-cut-multi-line;
			-webkit-line-clamp: 1;
			max-width: 6em;
		}
		& button {
			margin-top: .2rem;
			white-space: nowrap;
		}
	}
}
</style>