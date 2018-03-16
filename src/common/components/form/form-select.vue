<template>
	<div class="form_item form-select">
		<y-item v-bind="$props" v-model="checkValue" @click.native="handleClickItem" :id="field"></y-item>
		<y-modal ref="modal" v-bind="$props" v-if="!isPicker" :options="options">
			<section>
				<y-nav :title="title" :beforeBack="handleBack">
					<!--<y-button type="text" @click.native="handleSave" slot="nav-right" v-if="type !== 'radio'">完成</y-button>-->
				</y-nav>
				<div class="field_page-body">
					<slot>
						<y-check-group :data="optionsData" v-bind="$props" :type="type" v-model="vm[field]" ref="check_group" @clickItem="clickSelectItem"></y-check-group>
					</slot>
				</div>
			</section>
		</y-modal>
		<y-picker v-model="pickerVal" v-bind="$props" :selects="pickerData" :options="options" v-if="isPicker"></y-picker>
	</div>
</template>
<script>
import YItem from '@/components/item'
import YCheckGroup from '@/components/check-group'
import FormBase from './mixin'
import routerLinkMixin from '@/mixins/router-link';
import YModal from '@/components/modal'
import YPicker from '@/components/picker'

export default {
	name: 'y-form-select',
	components: {
		YItem, YModal, YPicker
	},
	mixins: [FormBase, routerLinkMixin],
	props: {
		...YItem.props,
		...YCheckGroup.props,
		optionsData: null,
		isPicker: { type: Boolean, default: false },
		clickable: { type: Boolean, default: true },
	},
	data() {
		return {
			checkValue: '',
			options: {
				trigger: '#' + this.field
			},
			pickerVal: {},

		}
	},
	computed: {
		pickerData() {
			if (!this.optionsData) {
				return [];
			}
			// picker组件需要展示的text数组
			var optionsList = this.optionsData.map((obj) => {
				return obj[this.textField] || obj;
			})
			return [{
				name: this.field,
				options: optionsList,
			}]
		}
	},
	methods: {
		handleClickItem() {
			this.$refs.modal.open();
		},
		handleBack() {
			if (this.$refs.modal.opened) {
				this.$refs.modal.close();
				return false;
			}
			return true;
		},
		clickSelectItem(item) {
			if (this.type === 'radio') {
				this.$refs.modal.close();
			}
			// model显示text， form提交的值vm[field]是id
			this.checkValue = this.$refs.check_group.getSelectedTexts().join();
			this.vm[this.field] = this.$refs.check_group.getSelectedIds().join();
		}
	},
	mounted() {
		// 处理原生返回事件
		this.$yryz.on('nativeBack', this.handleBack);
		let vmValue = this.vm[this.field];
		let checkedOptions = this.optionsData.filter((optionObj) => {
			return vmValue.includes(optionObj.id)
		})
		// show as string in item
		this.checkValue = checkedOptions.map((option) => { return option[this.textField] }).join(',');

	},
	watch: {
		'checkValue': function (newVal, oldVal) {
			if (newVal === oldVal || newVal === this.value) return false;
			this.$emit('change', newVal);
		},
		'pickerVal': function (newVal, oldVale) {
			this.checkValue = newVal[this.field];
			console.log('newVal[this.field]', newVal);
			// 有id值赋为id值，没有就为text值
			let idVal = this.optionsData.filter((item) => {
				let itemText = item[this.textField] || item;
				return itemText === newVal[this.field];
			})
			idVal = (idVal[0] && idVal[0][this.idField]) || idVal[0];
			this.vm[this.field] = idVal || newVal[this.field];
		},
		'$route'(newRoute) {
			if (this.$refs.modal.opened) {
				this.$refs.modal.close();
			}
		},
	},
	beforeDestroy() {
		this.$yryz.off('nativeBack', this.handleBack);
	}
}
</script>
<style>
.form-select {
	& .modal {
		& .modal-content {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			max-width: 100%;
			max-height: 100%;
			border-radius: 0;
			background: #f8f8f8;
		}
		& .mask {
			background: rgba(0, 0, 0, 0);
		}
	}
	& .field_page-body {
		& .check_item {
			padding: 0 0.3rem;
		}
	}
}
</style>

