import Vue from "vue";
import qs from "qs";

const request = (method, url, data) => {
	return Vue.opusApi({
		method: method,
		url: url,
		body: data
	});
};

export default {
	// 用户抽奖
	lottery(data) {
		return request("get",   "/yyl/v3/lottery/lottery?" + data);
	},
  // 查询可抽奖次数
	getUserLottery(data) {
		return request("get",  "/yyl/v3/lottery/getUserLottery?" + data);
	},
  // 查询中奖纪录
	getLogList(data) {
		return request('get', '/yyl/v3/lottery/getLogList?' + qs.stringify(data) )
		
	}
};
