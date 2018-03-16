<template>
	<div class="edit-name">
		<!-- 导航 S-->
		<y-nav title="修改成员咨询收费方式">
			<div slot="nav-right" class="edit-name-btn">
				<y-button type="text" @click.native="submit">保存</y-button>
			</div>
		</y-nav>
		<!-- 修改 -->
		<div class="edit-consultway">
			<y-check-group :data="dataway" v-model="dataway.id" type="radio" @clickItem="getItem">
				<template scope="data">
					<y-item :title="data.text">
						<div slot="foot" v-if="data.id === '2'" class="edit-number-container">
							<y-number v-model="num" :min="1" :max="100" :disabled="dataway.id === '1'"></y-number>
							<span class="edit-consulatway-time">悠然币/次</span>
						</div>
					</y-item>
				</template>
			</y-check-group>
		</div>
	</div>
</template>
<script>
import YItem from '@/components/item';
import YButton from '@/components/button';
import { YNav } from '@/components/nav';
import YCheckItem from '@/components/check-group/check-item'
import YCheckGroup from '@/components/check-group/check-group'
import YNumber from '@/components/number'
import Toast from '@/components/toast'
// import { YPublishButton, PublishMixin } from '@/components/content-publish'
export default {
	components: {
		YNav, YCheckItem, YCheckGroup, YNumber, YItem, YButton, Toast,
	},
	name: 'coterie',
	data() {
		return {
			num: 1,
			dataway: [],
			currItem: null,
		}
	},
	watch: {
		num(newVal, oldVal) {
			this.$nextTick(() => {
				this.num = Math.floor(newVal);
			})
		}
	},
	created() {
		this.$http.get(`/services/app/v1/coterie/info/single/${this.$route.params.coterieId}`).then(res => {
			this.dataway = [{ text: '免费', id: '1' }, { text: '收费', id: '2' }],
				this.coterieData = res.data.data;
			if (this.coterieData.consultingFee === 0) {
				this.dataway[0].checked = true;
				this.dataway[1].checked = false;
			} else {
				this.num = this.coterieData.consultingFee / 100;
				this.dataway[0].checked = false;
				this.dataway[1].checked = true;
			}
			this.currItem = this.dataway[this.coterieData.consultingFee === 0 ? 0 : 1];
		});

	},
	methods: {
		getItem(item) {
			console.log(item);
			this.currItem = item;
		},
		submit() {
			let parms = {
				consultingFee: this.currItem['id'] === '1' ? 0 : this.num * 100,
			}
			this.$http.put(`/services/app/v1/coterie/info/single/${this.$coterie.coterieId}`, parms).then(res => {
				if (res.data.code === '200') {
					this.$coterie.consultingFee = parms.consultingFee;
					Toast("修改成功！")
				} else {
					Toast(res.data.msg)
				}

			})
		}
	}
}	
</script>
<style>
@import '#/css/var.css';
.edit-name {
	color: var(--text-primary-color);
	& .edit-name-btn {
		color: var(--theme-color);
		font-size: .3rem;
	}
	& .edit-consultway {
		position: relative;
		padding-left: 0.2rem;
		background: #fff;
		font-size: .34rem;
	}
	& .edit-number-container {
		display: flex;
		& .button-sub,
		& .button-plus {
			flex: auto;
		}
		& i {
			color: var(--theme-color);
			font-size: .32rem;
		}
	}

	& .edit-consulatway-time {
		margin-left: .1rem;
	}
}
</style>