<!-- Author: Boring -->

<template>
	<y-popup v-show="true" :options="finalOptions" :class="classList">
		<div class="picker-panel">
			<div class="picker-toolbar">
				<y-button type="text" :disabled="!!transitioningSelects.length" @click.native="ok" class="picker-action picker-action--ok">确定</y-button>
				<y-button type="text" @click.native="clear" class="picker-action">清除</y-button>
				<y-button type="text" @click.native="cancel" class="picker-action picker-action--cancel">取消</y-button>
			</div>
			<div class="picker-selects">
				<div class="picker-highlight"></div>
				<y-picker-select v-for="(select, index) of selects" :key="index" v-model="localValue[select.name]" :name="select.name" :options="select.options" @transition-start="handleTransitionStart" @transition-end="handleTransitionEnd"></y-picker-select>
			</div>
		</div>
	</y-popup>
</template>

<script type="text/javascript">
import Button from '@/components/button';
import PickerSelect from './picker-select';
import popupMixin from '@/components/popup/mixin';

export default {
	name: 'y-picker',

	mixins: [
		popupMixin
	],

	components: {
		[Button.name]: Button,
		[PickerSelect.name]: PickerSelect,
	},

	props: {
		value: Object,
		selects: {
			type: Array,
			required: true
		}
	},

	data() {
		return {
			defaultOptions: {
				blankClose: false
			},
			visible: false,
			localValue: Object.assign({}, this.value),
			transitioningSelects: []
		};
	},

	computed: {
		classList() {
			return [
				'picker',
				{
					'picker--visible': this.visible
				}
			];
		},

		hasTransitioningSelects() {
			return !!this.transitioningSelects.size;
		}
	},

	watch: {
		value(newValue) {
			this.localValue = Object.assign({}, newValue);
		},

		localValue: {
			deep: true,

			handler(newValue) {
				this.$emit('changed', newValue);
			}
		}
	},

	methods: {
		open() {
			this.visible = true;
		},

		close() {
			this.visible = false;
		},

		ok() {
			this.$emit('input', Object.assign({}, this.localValue));
			this.close();
		},

		cancel() {
			this.localValue = Object.assign({}, this.value);
			this.close();
		},

		clear() {
			let result = Object.assign({}, this.localValue);

			for (let field in result) {
				result[field] = '';
			}

			this.$emit('input', {});
			this.localValue = result;
			this.close();
		},

		handleTransitionStart(selectName) {
			if (this.transitioningSelects.includes(selectName)) {
				return;
			}

			this.transitioningSelects.push(selectName);
		},

		handleTransitionEnd(selectName) {
			const index = this.transitioningSelects.indexOf(selectName);

			if (index < 0) {
				return;
			}

			this.transitioningSelects.splice(index, 1);
		},
	}
};
</script>

<style type="text/css">
@import "#/css/var.css";

.popup.picker {
	& .picker-panel {
		position: absolute;
	}
}

.picker .mask,
.picker-panel {
	transition: 0.4s;
}

.picker {
	visibility: hidden;
	font-size: .32rem;

	& .mask {
		opacity: 0;
	}
}

.picker-toolbar {
	@apply --clearfix;
	background: var(--bg-color);
}

.picker-action {
	float: right;
	font-size: .32rem;

	&:not(.picker-action--ok) {
		color: var(--text-secondary-color);
	}
}

.picker-action--cancel {
	float: left;
}

.picker-panel {
	left: 0;
	right: 0;
	bottom: 0;
	background: white;
	transform: translate(0, 100%);
}

.picker-highlight {
	@apply --full;
	height: 2.5em;
	margin: auto;
	border: solid var(--border-color);
	border-width: 0.01rem 0;
	background: var(--bg-color);
}

.picker-selects {
	position: relative;
	display: flex;
	height: 4rem;
	color: #999;
	text-align: center;

	& .swiper-slide-active {
		color: black;
	}
}

.picker--visible {
	visibility: visible;

	& .mask {
		opacity: 1;
	}
	& .picker-panel {
		transform: translate(0);
	}
}
</style>