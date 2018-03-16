import Vue from 'vue'
let eventBus = new Vue({
	data() {
		return { env: {userId: '', custId: '' }, circle: {}}
	}
});

eventBus.install = function (vue, options) {

	Vue.prototype.$eventBus = Vue.eventBus = eventBus;
}

export default eventBus