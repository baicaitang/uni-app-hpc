export default {
	dateTime(t) { // 首页时间
		let old = new Date(t)
		let now = new Date()
		// 获取old的具体时间
		let d = old.getTime()
		let h = old.getHours()
		let m = old.getMinutes()
		let Y = old.getFullYear()
		let M = old.getMonth() + 1
		let D = old.getDate()
		// 获取当前具体时间
		let nd = now.getTime()
		let nh = now.getHours()
		let nm = now.getMinutes()
		let nY = now.getFullYear()
		let nM = now.getMonth() + 1
		let nD = now.getDate()
		// console.log(M+"---"+nM)
		// 今天零点
		// let today = new Date();
		// today.setHours(0);
		// today.setMinutes(0);
		// today.setSeconds(0);
		// today.setMilliseconds(0);
		// let todayTime = today.getTime()
		// 昨天零点
		// let yesterday = new Date(today - 1);
		// yesterday.setHours(0);
		// yesterday.setMinutes(0);
		// yesterday.setSeconds(0);
		// yesterday.setMilliseconds(0);
		// let yesterdayTime = yesterday.getTime()
		// alert(todayTime-yesterdayTime)

		// 昨天
		// if (d < todayTime && d > yesterdayTime) {
		// 	return "昨天" + h + ":" + m
		// }

		// 昨天
		if (D + 1 === nD && M === nM && Y === nY) {
			if (h < 10) {
				h = "0" + h
			}
			if (m < 10) {
				m = "0" + m
			}
			return "昨天" + h + ":" + m
		}

		// 当天
		if (D === nD && M === nM && Y === nY) {
			if (h < 10) {
				h = "0" + h
			}
			if (m < 10) {
				m = "0" + m
			}
			return h + ":" + m
		}

		// 前天
		if (D + 2 === nD && M === nM && Y === nY) {
			if (h < 10) {
				h = "0" + h
			}
			if (m < 10) {
				m = "0" + m
			}
			return "前天" + h + ":" + m
		} else { //大于2天
			return Y + "/" + M + "/" + D
		}

	},
	detailTime(t) { // 用户详细时间
		let old = new Date(t)

		// 获取old的具体时间
		let d = old.getTime()
		let h = old.getHours()
		let m = old.getMinutes()
		let Y = old.getFullYear()
		let M = old.getMonth() + 1
		let D = old.getDate()

		// 处理时间
		if (M < 10) {
			M = '0' + M
		}
		if (D < 10) {
			D = '0' + D
		}
		if (h < 10) {
			h = '0' + h
		}
		if (m < 10) {
			m = '0' + m
		}
		return Y + '-' + M + '-' + D + '	' + h + ':' + m

	},
	dateTime2(t) { // 聊天时间
		let old = new Date(t)
		let now = new Date()
		// 获取old的具体时间
		let d = old.getTime()
		let h = old.getHours()
		let m = old.getMinutes()
		let Y = old.getFullYear()
		let M = old.getMonth() + 1
		let D = old.getDate()
		// 获取当前具体时间
		let nd = now.getTime()
		let nh = now.getHours()
		let nm = now.getMinutes()
		let nY = now.getFullYear()
		let nM = now.getMonth() + 1
		let nD = now.getDate()

		// 当天
		if (D === nD && M === nM && Y === nY) {
			if (h < 10) {
				h = "0" + h
			}
			if (m < 10) {
				m = "0" + m
			}
			return h + ":" + m
		}


		// 昨天
		if (D + 1 === nD && M === nM && Y === nY) {
			if (h < 10) {
				h = "0" + h
			}
			if (m < 10) {
				m = "0" + m
			}
			return "昨天" + h + ":" + m
		} else if (Y === nY) {
			//今年
			if (h < 10) {
				h = "0" + h
			}
			if (m < 10) {
				m = "0" + m
			}

			return M + "月" + D + '日' + h + ":" + m
		} else { //大于今年
			if (h < 10) {
				h = "0" + h
			}
			if (m < 10) {
				m = "0" + m
			}

			return Y + "年" + M + "月" + D + '日' + h + ":" + m
		}

	},
	spaceTime(old,now) { //间隔时间差
		old = new Date(old)
		now = new Date(now)
		var t_old = old.getTime()
		var t_now = now.getTime()
		if (t_old > (t_now + 1000 * 60 * 5)) {//5分钟内不显示时间
			return now
		}else{
			return ''
		}

	},
}
