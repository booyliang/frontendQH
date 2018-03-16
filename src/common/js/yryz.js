import eventBus from "./event-bus";
import http from "./http";
class JsSdk {
	constructor() {
		this.version = "0.1.0";
		this.callbacks = {};
		this.isVerification = false;
		this.appInfo = {};
		this.messageHandler = {};
		if (typeof window.addEventListener !== "undefined") {
			window.addEventListener("message", this.receiveData.bind(this), false);
		} else if (typeof window.attachEvent !== "undefined") {
			window.attachEvent("message", this.receiveData.bind(this));
		}
	}

	_send2Native(message) {
		let invokeData = JSON.stringify(message);
		if (window.JavascriptBridge && window.JavascriptBridge.invoke) {
			window.JavascriptBridge.invoke(invokeData);
		} else if (
			window.webkit &&
			window.webkit.messageHandlers &&
			window.webkit.messageHandlers.invoke
		) {
			window.webkit.messageHandlers.invoke.postMessage(invokeData);
		} else {
			return false;
		}
	}

	send2Native(invokeName, data, timeout, beforeInvoke) {
		return new Promise(async (resolve, reject) => {
			if (beforeInvoke) {
				data = await beforeInvoke(data);
			}
			let message = {
				data: data
			};
			message.invokeName = invokeName;
			let invokeId = new Date().getTime().toString();
			message.invokeId = invokeId;
			this.callbacks[invokeId] = {
				resolve,
				reject
			};
			// 防止服务器一直不返回
			if (timeout) {
				setTimeout(() => {
					let callback = this.callbacks[invokeId];
					if (!callback) return;
					reject("原生没有响应！");
					delete this.callbacks[invokeId];
				}, timeout);
			}
			if (this._send2Native(message) === false) {
				reject(null);
			}
		});
	}

	receiveData(event) {
		try {
			if (!event.data) return;
			let rawData = event.data;
			if (
				typeof rawData !== "string" ||
				(rawData.indexOf("errMsg") < 0 && rawData.indexOf("nativeEvent") < 0)
			) {
				typeof rawData === "string" && alert(rawData);
				return;
			}
			let data;
			data = JSON.parse(rawData);

			if (data.nativeEvent) {
				return this.handleNativeMessage(data);
			}
			let index = data.errMsg.indexOf(":");
			let invokeResult = data.errMsg.substring(index + 1);
			let invokeId = data.invokeId;
			let callback = this.callbacks[invokeId];
			if (!callback) return;
			if (invokeResult === "success") {
				return callback.resolve(data.data);
			} else {
				callback.reject(data);
			}
			delete this.callbacks[invokeId];
		} catch (ex) {
			alert(ex + ": rawData" + JSON.stringify(event.data));
		}
	}

	registerNative(invokeName, beforeInvoke) {
		return (data, timeout) => {
			if (this.isNative()) {
				return this.send2Native(invokeName, data, timeout, beforeInvoke);
			} else {
				console.error("无法调用原生方法:" + invokeName, data);
				console.log("无法调用原生方法:" + invokeName, data);
				return Promise.reject(new Error("无法调用原生方法:" + invokeName));
			}
		};
	}

	onNativeMessage(eventName, cb) {
		if (!this.messageHandler[eventName]) this.messageHandler[eventName] = [];
		this.messageHandler[eventName].unshift(cb);
	}

	offNativeMessage(eventName, cb) {
		let cbs = this.messageHandler[eventName];
		if (cbs) {
			this.messageHandler[eventName] = cbs.filter(func => func !== cb);
		}
	}

	async handleNativeMessage(message) {
		try {
			let cbs = this.messageHandler[message.nativeEvent];
			if (!cbs) {
				return;
			}
			for (let cb of cbs) {
				message.data = await cb(message.data);
				message.errMsg = message.nativeEvent + ":success";
				if (!message.data) break;
			}
			this._send2Native(message);
		} catch (ex) {
			message.errMsg = message.nativeEvent + ":error";
			this._send2Native(message);
		}
	}
	isNative() {
		return (
			(window.JavascriptBridge && window.JavascriptBridge.invoke) ||
			(window.webkit &&
				window.webkit.messageHandlers &&
				window.webkit.messageHandlers.invoke)
		);
	}
}
const sdk = new JsSdk();
let yryz = {
	httpRequest: sdk.registerNative("httpRequest"),
	alert: sdk.registerNative("alert"),
	test: sdk.registerNative("test"),
	shareToOtherPlat: sdk.registerNative("shareToOtherPlat"),
	uploadPics: sdk.registerNative("uploadPics"),
	uploadVideo: sdk.registerNative("uploadVideo"),
	uploadAudio: sdk.registerNative("uploadAudio"),
	showCharge: sdk.registerNative("showCharge"),
	pay: sdk.registerNative("pay"),
	reward: sdk.registerNative("reward"),
	getNetWorkStatus: sdk.registerNative("getNetWorkStatus"),
	getLocation: sdk.registerNative("getLocation"),
	backHome: sdk.registerNative("backHome"),
	openUrl: sdk.registerNative("openUrl"),
	circleShortcut: sdk.registerNative("circleShortcut"),
	toPersonalInfo: sdk.registerNative("toPersonalInfo", async data => {
		if (data.userId.length >= 18) {
			return data;
		} else {
			let res = await http.get("/services/app/v1/user/info/" + data.userId);
			data.userId = res.data.data.custId;
		}
		return data;
	}),
	forward: sdk.registerNative("forward"),
	createImageText: sdk.registerNative("createImageText"),
	httpHeader: sdk.registerNative("httpHeader"),
	createCircleTeam: sdk.registerNative("createCircleTeam"),
	joinTeam: sdk.registerNative("joinTeam"),
	sessionTeam: sdk.registerNative("sessionTeam"),
	sessionP2P: sdk.registerNative("sessionP2P"),
	statusBar: sdk.registerNative("statusBar"),
	report: sdk.registerNative("report"),
	pasteboard: sdk.registerNative("pasteboard"),
	back: sdk.registerNative("back"),
	playVideo: sdk.registerNative("playVideo"),
	publishImageText: sdk.registerNative("publishImageText"),
	publishResult: sdk.registerNative("publishResult"),
	isNative: sdk.isNative,
	isIOS: function () {
		return !!(window.webkit &&
			window.webkit.messageHandlers &&
			window.webkit.messageHandlers.invoke);
	},
	on: sdk.onNativeMessage.bind(sdk),
	off: sdk.offNativeMessage.bind(sdk),
	infoRemove: sdk.registerNative("infoRemove"),
	login: sdk.registerNative("login"),
	openAPP: sdk.registerNative("openAPP"),
	mapNavigation: sdk.registerNative("mapNavigation"),
	finishLoading: sdk.registerNative("finishLoading"),
	openSetting: sdk.registerNative("openSetting"),
	jumpUrl: sdk.registerNative("jumpUrl"),
	broadcast: sdk.registerNative("broadcast"),
	saveImage: sdk.registerNative("saveImage"),
	kickOut: sdk.registerNative("kickOut"), // 用户被踢下线
};
yryz.install = function (Vue) {
	Vue.yryz = Vue.prototype.$yryz = yryz;
};
export default yryz;