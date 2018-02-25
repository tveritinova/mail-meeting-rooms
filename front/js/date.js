
export const two_digit = (num) => {
	console.log('num', num);
	return ("0" + num).slice(-2);
}

export const get_date = (cur, time) => {

	if (cur.getFullYear() === time.getFullYear()) {
		if ((cur.getDate() === time.getDate()) &&
			(cur.getMonth() === time.getMonth())) {
			return ''
		} else {
			return two_digit(time.getDate())+'.'+two_digit(time.getMonth()+1)
		}
	} else {
		return two_digit(time.getDate())+'.'+two_digit(time.getMonth()+1)+'.'+time.getFullYear() 
	}
	
}

export const get_string_date = (time, cur) => {
	return two_digit(time.getHours())+':'+two_digit(time.getMinutes())+' '+get_date(cur, time)
}

export const get_string = (time) => {
	var res = time.getFullYear() + '-' + two_digit(time.getMonth()+1) + '-' + two_digit(time.getDate()) +
		' ' + two_digit(time.getHours())+':'+two_digit(time.getMinutes())+':'+two_digit(time.getSeconds())
	console.log(res);
	return res;
}