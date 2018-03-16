export default function calcAge(value) {
	if (!value) return "";
	var dateArr = value.split(/[- :]/);
	const date = new Date(
    dateArr[0],
    dateArr[1] - 1,
    dateArr[2],
    dateArr[3],
    dateArr[4],
    dateArr[5]
  );

	let currentDate = new Date();
	let durationTime = currentDate.getTime() - date; // 时间间隔
	let year = parseInt(durationTime / (60 * 60 * 1000 * 24 * 365)) + "";
	let month = Math.trunc(durationTime / (60 * 60 * 1000 * 24 * 30)) % 12 + "";

	if (year > 0) {
		let ret = year + "岁";
		if (month > 0) {
			ret += month + "个月";
		}
		return ret;
	}
	if (month > 0) {
		return month + "个月";
	}
	let day = Math.trunc(durationTime / (60 * 60 * 1000 * 24)) + "";
	return day + "天";
}
