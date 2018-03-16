import Vue from "vue";
import share from "./share";

let shareUI = Vue.extend(share);
let singleInst;

function getInstance(eventName) {
	if (!singleInst) {
		singleInst = new shareUI({
			el: document.createElement("div")
		});
		singleInst.eventName = eventName;
		console.log(singleInst);
		let container = singleInst.$el;
		document.body.appendChild(container);
	}
	return singleInst;
}

export default {
	share: function (data, useOpusApi, actions, eventName) {
		let share = getInstance(eventName);
		share.open(data, useOpusApi, actions);
	}
};
