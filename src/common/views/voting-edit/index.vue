<template>
	<div class="voting_edit">
		<y-nav :transparent="false" :title="$R('voting-add')" :beforeBack="handleBack">
			<span slot="nav-right"  @click="handlePublish" class="voting_edit-btn_pub">
				<y-button type="text">{{$R('publish')}}</y-button>
			</span>
			<!--<span slot="nav-right"  @click="handlePublish" class="voting_edit-btn_pub">
				<y-publish-button type="text" >{{$R('publish')}}</y-publish-button>
			</span>-->
		</y-nav>
		</y-nav>
	
		<div class="voting_edit-title">
			<y-input :maxlength="30" :placeholder="$R('voting-add-title')" v-model="voteVm.vote.title" class="voting_edit-input_title"></y-input>
		</div>
		<div class="voting_edit-body">
	
			<div class="voting_edit-option" v-for="(item, index) of voteVm.voteItems" :key="index">
				<span @click="delOption(index)" v-if="!item.required" class="iconfont icon-plus-o icon_action"></span>
				<y-input v-model="item.content" :showTextLengthInfo="false" :maxlength="30" :placeholder="$R('voting-option')+(index+1) + (item.required ? '' : $R('voting-optional'))" :class="{'is-required':item.required}"></y-input>
				<span class="iconfont icon-close-a" v-show="showClearIcon(item.content)" @click="clearOption(item)"></span>
			</div>
	
			<div class="voting_edit-btn_add" @click="addOption " v-show="optionCount < 10">
				<span class="iconfont icon-plus-circle icon_action"></span>{{$R('voting-max-option')}}</div>
		</div>
		<div class="voting_edit-type">
			<y-item :title="$R('voting-type')">
				<template slot="foot">
					<y-check-group :data="typeList" type="radio" ref="voteType" @clickItem="clickItem"></y-check-group>
				</template>
			</y-item>
		</div>
		<div class="voting_edit-end_Date">
			<y-item :title="$R('voting-end-date')"  @click.native="choseTime" :placeholder="$R('voting-chose-time')" :value="voteVm.vote.endDate" id="trigger">
			</y-item>
		</div>
		<y-date-picker v-model="voteVm.vote.endDate" format="Y-M-D" :options="options" ref="picker"></y-date-picker>
	</div>
</template>
<script>
import YInput from '@/components/input'
import YItem from '@/components/item'
import YButton from '@/components/button'
import YPublishButton from '@/components/content-publish/publish-button';
import YCheckGroup from '@/components/check-group'
import { YNav } from '@/components/nav'
import Toast from '@/components/toast'
import Publish from "../publish/mixin"
import YDatePicker from '@/components/date-picker'
import moment from 'moment'
export default {
	name: 'y-voting-edit',
	components: {
		YInput, YItem, YPublishButton, YCheckGroup, YNav, Toast, YDatePicker
	},	
	mixins: [Publish],
	props: {},
	data() {
		return {
			options: {
				trigger: '#trigger'
			},
			voteVm: {
				vote: {
					title: '',
					type: "1",
					endDate: "",
				},
				voteItems: [
					{content: '', required: true},
					{content: '', required: true}
				],
			},
			optionCount: 2,
			end_time: '',
			typeList: [{id: "1", text: this.$R('voting-radio'), checked: true}, {id: "2", text: this.$R('voting-checkbox')}],
		}
	},
	watch: {
		'voteVm.vote.endDate': function (newVal, oldVal) {
			let curDate = moment(new Date()).format('YYYY-MM-DD');
			if (!newVal) {
				return;
			} 
			if (newVal < curDate) {
				this.$toast('请选择当前或之后的日期');
				this.voteVm.vote.endDate = '';
				return;
			} 
			this.voteVm.vote.endDate = newVal;
		}
	},
	methods: {
		choseTime() {
			let curDate = moment(new Date()).format('YYYY-MM-DD');
			if (!this.voteVm.vote.endDate) {
				this.voteVm.vote.endDate = curDate;
			}
		},
		handleBack() {
			// this.$localStore.set('vote-content', this.voteVm());
			this.back();
		},
		clearOption(item) {
			item.content = "";
		},
		showClearIcon(val) {
			if (val.trim().length > 0) {
				return true;
			}
			return false;

		},
		addOption() {
			if (this.optionCount < 10) {
				this.voteVm.voteItems.push({content: ''});
				this.optionCount++;
			}
		},
		delOption(index) {
			this.voteVm.voteItems.splice(index, 1);
			this.optionCount--;
		},
		clickItem() {
			this.voteVm.vote.type = this.$refs.voteType.getSelectedIds()[0];
		},
		validVoting() {
			var titleLen = this.voteVm.vote.title.trim().length;
			if (titleLen < 2) {
				Toast(this.$R('voting-valid-title', 2));
				return false;
			}
			let validItems = this.voteVm.voteItems.filter((item) => item.content.trim().length > 0);
			if (validItems.length < 2) {
				Toast(this.$R('voting-valid-option', 2));
				return false;
			}
			this.voteVm.voteItems = validItems;
			this.optionCount = this.voteVm.voteItems.length;
			return true;

		},
		async handlePublish() {
			if (!this.validVoting())
				return false;
			if (this.voteVm.vote.endDate) {
				this.voteVm.vote.endDate += " 23:59:59";
			}
			let endDate = this.voteVm.vote.endDate;
			try {
				let res = await
					this.saveVoting(this.voteVm);
				if (res.data.code === '200' && res.data.data) {
					Toast(this.$R("publish-success"));
					this.$router.back();
					this.$localStore.remove("vote-content");
					this.voteVm.vote.endDate = endDate.replace(" 23:59:59", "");
					return;
				}
				this.voteVm.vote.endDate = endDate.replace(" 23:59:59", "");
				Toast(this.$R("public-failed"));
			}
			catch (ex) {
				this.voteVm.vote.endDate = endDate.replace(" 23:59:59", "");
				throw this.$R("public-failed")
			}
		}
	},
	async mounted() {
		this.voteVm = await this.$localStore.getOrSet('vote-content', null, this.voteVm);
	}

}
</script>
<style>
@import '#/css/var.css';
.voting_edit {
	margin-top: 0.2rem;
	& .voting_edit-btn_pub {
		color: #fb6b90;
		font-size: .3rem;
	}
	& .voting_edit-title input{
			height: 1.12rem;
			font-size: .36rem;
		}
	& .voting_edit-body {
		margin-top: 0.2rem;

		& input,& textarea {
           font-size: .34rem;
		}
		
		& .icon_action {
			color: #bfbfbf;
			font-size: .4rem;
			line-height: 1.12rem;
			display: inline-block;
			width: 0.7rem;
			background: #fff;
			padding-left: 0.3rem;
		}
		& .voting_edit-option {
			@apply --border-bottom;
			display: flex;
			height: 1.12rem;
			flex-direction: row;
			& span {}
			& .is-required {
				& input {
					margin-left: 0.7rem;
				}
			}
			& .icon-close-a {
				color: #bfbfbf;
				font-size: .28rem;
				background: #fff;
				line-height: 1.12rem;
				padding-right: 0.5rem;
			}
		}
	}
	& .voting_edit-btn_add {
		background-color: #fff;
		height: 1.12rem;
		line-height: 0.9rem;
		font-size: .34rem;
		& .icon_action {
			margin-right: 0.3rem;
		}
	}
	& .voting_edit-type {
		margin-top: 0.2rem;
		margin-bottom: 0.2rem;
		& .check_group .check_item {
			display: inline-flex;
			margin-left: 0.3rem;
			& span {
				display: inline;
			}
			& i {
				display: inline;
				flex: 0;
			}
		}
		& .check_item {
			border-bottom: 0;
		}
		& .checkedItem {
			color: var(--theme-color);
		}

		& .item-wrap {
			padding: 0 0.16rem;
		}
	}
	& .item-title {
		font-size: .34rem;
		color: var(--text-primary-color);
	}
	& .item-foot {
		justify-content: flex-end;
	}
}
.voting_edit-option .y-input-wrap{
	border-top:none;
}
</style>