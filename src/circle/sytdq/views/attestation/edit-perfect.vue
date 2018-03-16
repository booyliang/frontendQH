<template>
	<div id="app" class="jkys-attestation-info">
		<y-nav title="填写认证信息" :beforeBack="beforeBack"></y-nav>
		<div class="">
			<y-list>
				<y-item>
					<y-input v-model="vm.data.organization" :maxlength="30" placeholder="请输入单位/组织信息" :show-text-length-info="false"></y-input>
				</y-item>
				<y-item>
					<y-input v-model="vm.data.occupation" :maxlength="30" placeholder="请输入职位/称号信息(不超过30字)" :show-text-length-info="false"></y-input>
				</y-item>
				<y-item>
					<y-input v-model="vm.data.authenticationSpecification" :maxlength="30" placeholder="请输入认证说明(不超过30字)" :show-text-length-info="false"></y-input>
				</y-item>
				<y-item>
					<input v-model="tags" type="" placeholder="请输入标签(如摄影等，最多7个字，用逗号隔开)" />
				</y-item>
				<y-item>
					<dl class="jkys-write-info-data">
						<dl>上传以下证明材料</dl>
						<dd>
							<div class="delect_btn" v-if="imgsrc1!=''" @click="deleteImg1()">删除</div>
							<img :src="imgsrc1" alt="" v-if="imgsrc1!=''" />
	
							<div @click='permit' tag="div" v-if="imgsrc1==''">
								<i class="font font-add"></i>
								<b>职位/称号
									<br/>证明材料</b>
							</div>
						</dd>
						<dd>
							<div class="delect_btn" v-if="imgsrc2!=''" @click="deleteImg2()">删除</div>
							<img :src="imgsrc2" alt="" v-if="imgsrc2!=''" />
	
							<div @click='handCard' tag="div" v-if="imgsrc2==''">
								<i class="font font-add"></i>
								<b>手持
									<br/>身份证</b>
							</div>
						</dd>
						<dd>
							<div class="delect_btn" v-if="imgsrc3!=''" @click="deleteImg3()">删除</div>
							<img :src="imgsrc3" alt="" v-if="imgsrc3!=''" />
	
							<div @click='idCard' tag="div" v-if="imgsrc3==''">
								<i class="font font-add"></i>
								<b>身份证
									<br/>正面照</b>
							</div>
						</dd>
					</dl>
				</y-item>
	
			</y-list>
			<!--<label class="jkys-info-check"><span @click="toggle" v-bind:class="{ 'check-a' : isA, 'check-b': !isA}" ></span>我已阅读并同意《<b>悠然一指认证用户管理条例</b>》 </label>-->
			<y-button block @click.native="onClick" class="jkys-attestation-button">下一步</y-button>
		</div>
	
	</div>
</template>

<script>
import { YNav } from '@/components/nav';
import List from '@/components/list';
import Item from '@/components/item';
import Button from '@/components/button';
import Toast from '@/components/toast';
import YInput from '@/components/input';
export default {
	components: {
		YNav,
		[List.name]: List,
		[Item.name]: Item,
		[Button.name]: Button,
		YInput
	},
	data() {
		return {
			disabled: false,
			vm: {
				data: {}
			},
			imgsrc1: '',
			imgsrc2: '',
			imgsrc3: '',
			tags: '',
		}

	},
	created() {
		this.vm = this.$localStore.get('petDeta');
		this.imgsrc1 = this.vm.data.certificationMaterialsImg;
		this.imgsrc2 = this.vm.data.faceAndIdImg;
		this.imgsrc3 = this.vm.data.idImg;
		this.tags = this.vm.data.label;
		console.log(this.vm);
	},
	watch: {
		tags(value, obkey) {
			let arr = [];
			let Obj = value.split('，');
			for (let i = 0; i < Obj.length; i++) {

				if (i > 6) {
					// this.disabled = true;
					break;
				}
				// console.log(Obj[i]);
				if (Obj[i].length > 7) {
					arr.push(Obj[i].substring(0, 7))
				} else {
					arr.push(Obj[i])
				}
			}

			this.tags = arr.join('，');
			console.log(this.tags)

			if (this.tags) {
				this.vm.data.label = this.tags
			}
		}
	},
	methods: {
		beforeBack() {
			// 
			this.$router.replace(`/shoot/basic/${this.$route.params.id}`)
			return false;
		},

		permit() {
			this.$router.replace(`/shoot/permit/${this.$route.params.id}`)
			return false;
		},

		handCard() {
			this.$router.replace(`/shoot/hand-card/${this.$route.params.id}`)
			return false;
		},

		idCard() {
			this.$router.replace(`/shoot/id-card/${this.$route.params.id}`)
			return false;
		},

		onClick() {
			this.vm.data.label = this.tags;

			var postData = {
				...this.vm.data
			}
			console.log(postData);
			if (!postData.authenticationSpecification) {
				Toast('认证说明不能为空');
				return false;
			} else if (!postData.label) {
				Toast('标签不能为空');
				return false;
			} else if (!postData.certificationMaterialsImg) {
				Toast('证明材料不能为空');
				return false;
			} else if (!postData.faceAndIdImg) {
				Toast('手持身份证照不能为空');
				return false;
			} else if (!postData.idImg) {
				Toast('身份证正面照不能为空');
				return false;
			}

			console.log(postData);
			let methods = postData.id ? 'put' : 'post';
			let Murl = postData.id ? '/services/app/v1/photographer/single' : '/services/app/v1/photographer/single'
			this.$http[methods](Murl, postData).then((res) => {
				if (res.data.code === '200') {
					let message = postData.id ? '修改成功' : '提交成功';
					Toast(message);
					this.$router.replace('/shoot/audit');
					this.$localStore.remove('petDeta');
				}
			})
		},
		deleteImg1() {
			this.imgsrc1 = '';
			this.vm.data.certificationMaterialsImg = '';
		},
		deleteImg2() {
			this.imgsrc2 = '';
			this.vm.data.faceAndIdImg = '';
		},
		deleteImg3() {
			this.imgsrc3 = '';
			this.vm.data.idImg = '';
		}
	}

}
</script>

<style>
@import '#/css/var.css';
.jkys-attestation-info {
	& .list {
		margin-top: 0.3rem;
		& input {
			width: 100%;
			font-size: var(--default-font-size);
		}
		&>div:last-child .item-wrap {
			padding: 0.3rem 0.16rem 0.4rem;
		}
		& .jkys-write-info-data {
			& dl {
				color: var(--text-secondary-color);
				margin-bottom: 0.36rem;
			}
			& dd {
				float: left;
				width: 1.6rem;
				height: 1.6rem;
				border: 0.03rem solid #bfbfbf;
				border-radius: 0.1rem;
				margin-right: 0.16rem;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 10px;
				color: var(--text-assist-color);
				line-height: 0.24rem;
				text-align: center;
				position: relative;
				& img {
					width: 1.6rem;
					height: 1.6rem;
				}
				& .delect_btn {
					height: 0.46rem;
					line-height: 0.46rem;
					position: absolute;
					background: color(#000 alpha(0.2));
					left: 0;
					right: 0;
					bottom: 0;
					color: #fff;
					font-size: 11px;
				}
				& .font {
					color: var(--text-assist-color);
					font-size: 15px;
					margin-bottom: 0.2rem;
					display: block;
				}
				&:last-child {
					margin-right: 0;
				}
			}
		}
	}
	& .jkys-info-check {
		padding: 0.3rem 0.3rem 0;
		display: flex;
		align-items: center;
		color: var(--text-secondary-color);
		font-size: 12px;
		& b {
			color: #00aff7;
		}
	}
	& .input-bottom-txt {
		display: none;
	}
}
</style>