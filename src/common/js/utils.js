import commonModules from "@/config/modules";
import appConfigs from "@/config/open_app";
import eventBus from "./event-bus";
let modules = commonModules;
let utils = {
	getUrl(path, params) { },
	getShareUrl() {
		return window.location.href;
	},
	alert(...rests) {
		if (
			window.location.href.indexOf("web.") === -1 &&
			window.location.href.indexOf("m.") === -1 &&
			window.location.href.indexOf("m-mo.") === -1 &&
			window.location.href.indexOf("web-mo.") === -1
		) {
			let err = "";
			for (let rest of rests) {
				if (!rest) continue;
				if (typeof rest === "object") {
					err += JSON.stringify(rest);
				} else {
					err += rest;
				}
			}
			alert(err);
		}
	},
	getModule(id) {
		const module = modules[id];

		if (!module) {
			console.error(`Module "${id}" doesn't exist.`);
		}

		return module;
	},

	async openAPP(appName, vue) {
		let isApple = !!(window.navigator.userAgent
			.toLowerCase()
			.indexOf("chrome") < 0 || vue.$env.devType === "1");
		let appConfig = appConfigs[appName];
		let config = Object.assign(
			{},
			isApple ? appConfig["iOS"] : appConfig["android"]
		);
		for (let key in config) {
			if (typeof config[key] === "function") {
				config[key] = config[key].call(vue);
			}
		}
		return vue.$yryz.openAPP(config);
	},
	refreshOnBack() {
		eventBus.$emit("global-message", { type: "refreshOnBack" });
	},
	refresh() {
		eventBus.$emit("global-message", { type: "refresh" });
	},
	goBack() {
		if (document.getElementById("navigator")) {
			eventBus.$emit("goBack");
		} else {
			window.history.go(-1);
		}
	},
	setBrowserShareInfo(title, description) {
		const doc = window.document;
		if (title) {
			doc.title = title || '圈乎';
		}
		if (description) {
			let descriptionEl = doc.querySelector('meta[name="description"]');
			if (!descriptionEl) {
				descriptionEl = doc.createElement('meta');
				descriptionEl.setAttribute('name', 'description');
				doc.head.appendChild(descriptionEl);
			}
			descriptionEl.setAttribute('content', description);
		}
	}
};

utils.install = function (Vue, options) {
	// console.log(options.circleInfo)
	let { circleModules, circleInfo } = options;
	modules = Object.assign(modules, circleModules);
	utils.NODE_ENV = circleInfo.NODE_ENV;
	// console.log('utils', utils)
	Vue.prototype.$utils = Vue.utils = utils;
};
export default utils;
