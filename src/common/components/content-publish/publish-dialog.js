import Vue from 'vue';
import PublishMask from './publish-mask.vue';

let PublishComponent = Vue.extend(PublishMask);
let singleInst;

function getInstance() {
	if (!singleInst) {
		singleInst = new PublishComponent({
			el: document.createElement('div'),

		});
		let container = singleInst.$el;
		document.body.appendChild(container);
	}

	return singleInst;
}

function open(config = {}) {
	let inst = getInstance();
	inst.visible = true;
}

function close() {
	let inst = getInstance();
	inst.visible = false;
}

export default {
	open,
	close
};