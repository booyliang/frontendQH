import Vue from 'vue';
import BlockUI from './block-ui';

let BlockUIComponent = Vue.extend(BlockUI);
let singleInst;

function getInstance() {
	if (!singleInst) {
		singleInst = new BlockUIComponent({
			el: document.createElement('div'),
		});
		let container = singleInst.$el;
		document.body.appendChild(container);
	}

	return singleInst;
}

function open(options, fn) {
	let inst = getInstance();
	inst.propsData = options.props;
	inst.target = options.target;
	inst.component = options.component;
	inst.visible = true;
	if (typeof fn === "function") { fn() };
}

function close(fn) {
	let inst = getInstance();
	inst.visible = false;
	if (typeof fn === "function") { fn() };
}

export default {
	open,
	close
};