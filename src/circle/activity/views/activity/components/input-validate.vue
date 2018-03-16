<template>
    <div class="input-validate-wrapper">
        <input type = "text" v-if = "type == 'text' " class="input" :placeholder="placeholder" v-model="text" @input="handInput">
        <div class = "sendCode" v-if = "type == 'sendCode'">
             <input type = "text" :placeholder="placeholder" v-model="text" @input="handInput">
             <span @click="sendCode">{{ sendStatus }}</span>
        </div>
    </div>
</template>

<script>
import Toast from '@/components/toast';
export default {
	name: "y-input-validate",
	created() {
		if (this.type === 'email') {
			this.placeholder = "请输入邮箱";
		} else if (this.type === 'url') {
			this.placeholder = "请输入url";
		} else if (this.type === "sendCode") {
			this.placeholder = "请输入验证码";
		}
	},
	data() {
		return {
			share: {},
			placeholder: "请输入手机号码",
			text: this.value
		}
	},
	props: {
		type: {
			type: String,
			default: "text"
		},
		sendStatus: {
			type: String,
			default: "发送验证码"
		},
		value: {
			type: [String, Number],
			default: ''
		}
	},
	methods: {
		sendCode() {
			const regPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
			if (this.type === "sendCode") {
				if (this.text === "") {
					Toast("手机号码不能为空");
					return;
				}
				if (!regPhone.test(this.text)) {
					Toast("您输入的手机号无效");
					return;
				}
			}
			this.$emit('send');
		},
		handInput(event) {
			let value = event.target.value;
			this.$emit('input', value);
		}
	}
}
</script>

<style>
    .input-validate-wrapper {
        padding:.2rem .3rem;
        & input[type="text"] {
            height: .8rem;
            text-align: left;
            font-size:15px;
            box-sizing:border-box;
            padding-left:.24rem;
        }
        & .input {
            display: block;
            width: 100%;
            border: #e4e4e4 solid 1px;
            color:#aaaaaa;
            border-radius:8px;
        }
        & .sendCode {
            display: flex;
            align-items: center;
            border: #e4e4e4 solid 1px;
            border-radius:8px;
            & input {
                flex:1;
                border:none;
                font-size:15px;
                color:#aaaaaa;
                border-right:solid 1px #e4e4e4;
            }
            & span {
                width:2.12rem;
             
                background:#f8f8f8;
                text-align:center;
                color:#0185ff;
            }
        }
    }
</style>

