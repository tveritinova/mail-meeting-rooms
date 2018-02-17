import React from "react";
import { StyleSheet, css } from 'aphrodite';


export default class Room extends React.Component {

  found_next_free(events, ind) {
  	console.log("found_next_free");
  	console.log(events, ind);
  	for (var i = ind + 1; i < events.length; i++) {
  		if (events[i-1]['end'].getTime() !== events[i]['start'].getTime()) {
  			return events[i-1]['end'];
  		}
  	}

  	return events[events.length - 1]['end'];
  }

  get_date(cur, time) {

  	if (cur.getFullYear() === time.getFullYear()) {
  		if ((cur.getDate() === time.getDate()) &&
  			(cur.getMonth() === time.getMonth())) {
  			return ''
  		} else {
  			return this.two_digit(time.getDate())+'.'+this.two_digit(time.getMonth())
  		}
  	} else {
  		return this.two_digit(time.getDate())+'.'+this.two_digit(time.getMonth())+'.'+time.getFullYear() 
  	}
  	
  }

  two_digit(num) {
  	return ("0" + num).slice(-2);
  }

  render () {
  	var cur = this.props.current;
  	var sorted_events = this.props.events;

  	console.log('cur', cur);
  	//console.log('events', sorted_events);

  	var found;
  	for (var i = 0; i < sorted_events.length; i++) {
  		if (sorted_events[i]['start'] >= cur) {
  			found = i;
  			break;
  		}
  	}
  	
  	var is_free;
  	var next_time_free;
  	var next_time_closed

  	//console.log('found', found);

  	if (found === undefined) {
  		if (sorted_events[sorted_events.length - 1]['end'] >= cur) {
  			is_free = false;
  			next_time_free = sorted_events[sorted_events.length - 1]['end'];
  		} else {
  			is_free = true;
  		}

  	} else {
  		//console.log(cur, sorted_events[found]['start'], cur == sorted_events[found]['start']);
  		if (cur.getTime() === sorted_events[found]['start'].getTime()) {
  			is_free = false;
  			next_time_free = this.found_next_free(sorted_events, found);
  			//console.log("eq start");
  		} else {
  			//console.assert(cur < sorted_events[found]['start']);

  			if ((found == 0) || (cur >= sorted_events[found-1]['end'])) {
  				is_free = true;
  				next_time_closed = sorted_events[found]['start'];
  			} else {
  				is_free = false;
  				next_time_free = sorted_events[found-1]['end'];
  			}
  		}
  	}

  	//console.log("next_time_closed", next_time_closed);
  	//console.log("next_time_free",next_time_free);

  	var status;
  	var time;
  	var style;
  	if (is_free) {
  		time  = next_time_closed;
  		style = css(styles.statusLabel, styles.statusFree);
  		if (time === undefined) {
  			status =  <div className={style}>Свободно</div>
  		} else {
	  		status = 
	  		<div className={style}>
	  			Свободно до {this.two_digit(time.getHours())}:{this.two_digit(time.getMinutes())} {this.get_date(cur, time)}
	  		</div>;
	  	}
  	} else {
  		time = next_time_free;
  		style = css(styles.statusLabel, styles.statusBooked);
  		status = 
  		<div className={style}>
  			Занято до {this.two_digit(time.getHours())}:{this.two_digit(time.getMinutes())} {this.get_date(cur, time)}
  		</div>;
  	}

    return (
    <div className={css(styles.cell)}>
    	<div className={css(styles.name)}>{this.props.name}</div>
    	{status}
    </div>);
  }
}

const styles = StyleSheet.create({
    cell: {
        textAlign: 'center',
        padding: '10 10 10 10'
    },
    name: {
    	fontWeight: 'bold',
    	marginBottom: 10
    },
    statusLabel: {
    	borderRadius: '5px',
    	margin: 'auto'
    },
    statusFree: {
    	backgroundColor: '#2ECC40'
    },
    statusBooked: {
    	backgroundColor: '#FF4136'
    },
});