export default function recentTime(value) {
	if (!value) return "";
	function numberDouble(num) {
		return num >= 10 ? num : 0 + "" + num;
	}
	var date = null;
	
	if (typeof value === 'number') {
		date = new Date(value)
	} else {
		var dateArr = value.split(/[- :]/);
		if (dateArr.length !== 6) {
			return value;
		}
		date = new Date(
		dateArr[0],
		dateArr[1] - 1,
		dateArr[2],
		dateArr[3],
		dateArr[4],
		dateArr[5]);
	}
	
	const timeDate = date.getTime();
	let currentDate = new Date();
	let durationTime = (timeDate - currentDate.getTime()) * -1; // 时间间隔

	const minuteTime = 60 * 1000; // 一分钟的毫秒数
	const hoursTime = 60 * minuteTime; // 一小时的毫秒数
	const dayTime = 24 * hoursTime; // 一天的毫秒数
	const yearTime = 365 * dayTime; // 一年的毫秒数
	if (durationTime < 0) {
		return "刚刚";
	}
	if (durationTime < minuteTime) {
		return "刚刚";
	}
	if (durationTime < hoursTime) {
		return parseInt(durationTime / minuteTime) + "分钟前";
	}
	if (durationTime < dayTime) {
		return parseInt(durationTime / hoursTime) + "小时前";
	}
	if (
    durationTime < 2 * dayTime && currentDate.getDate() - date.getDate() <= 1
  ) {
		return (
      "昨天" +
      " " +
      numberDouble(date.getHours()) +
      ":" +
      numberDouble(date.getMinutes())
		);
	}
	if (durationTime < yearTime) {
		return (
      numberDouble(date.getMonth() + 1) +
      "-" +
      numberDouble(date.getDate()) +
      " " +
      numberDouble(date.getHours()) +
      ":" +
      numberDouble(date.getMinutes())
		);
	}
	return (
    date.getFullYear() +
    "-" +
    numberDouble(date.getMonth() + 1) +
    "-" +
    numberDouble(date.getDate()) +
    " " +
    numberDouble(date.getHours()) +
    ":" +
    numberDouble(date.getMinutes())
	);
}
