import Vue from 'vue'
import mapNav from './src/main.vue'
let mapComponent = Vue.extend(mapNav)
let mapInstance = new mapComponent({
	el: document.createElement('div')
})
export default {
	init(options) {
		if (!options) {
			console.error("Parameters cannot be empty");
			return false;
		}
		mapInstance.options = options;
		document.body.appendChild(mapInstance.$el);
		mapInstance.show = true;
		mapInstance.init();
	},
	hide() {
		mapInstance.show = false;
	}
}