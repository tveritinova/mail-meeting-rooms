import React from "react";
import { StyleSheet, css } from 'aphrodite';
import {get_string_date} from "./date";

export default class Room extends React.Component {

  found_next_free(events, ind) {
  	//console.log("found_next_free");
  	//console.log(events, ind);
  	
  	for (var i = ind + 1; i < events.length; i++) {
  		if (events[i-1]['end'].getTime() !== events[i]['start'].getTime()) {
  			return events[i-1]['end'];
  		}
  	}

  	return events[events.length - 1]['end'];
  }

  render () {
    console.log('room', this.props.name);

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

  	console.log('found', found);

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
          console.log("here");
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
  			status = 
          <div className={style}>
            Свободно
          </div>
  		} else {
	  		status = 
	  		<div className={style}>
	  			Свободно до {get_string_date(time, cur)}
	  		</div>;
	  	}
  	} else {
  		time = next_time_free;
  		style = css(styles.statusLabel, styles.statusBooked);
  		status = 
  		<div className={style}>
  			Занято до {get_string_date(time, cur)}
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
      padding: '5 5 5 5'
    },
    name: {
    	fontWeight: 'bold',
    	marginBottom: 5,
    	fontSize: '10pt'
    },
    statusLabel: {
    	borderRadius: '5px',
    	fontSize: '8pt',
      height: 30,
      display: 'table-cell',
      verticalAlign: 'middle',
      width: '1%',
      color: 'white'
    },
    statusFree: {
    	//backgroundColor: '#2ECC40'
      //background: 'linear-gradient(-15deg, #11998e 0%, #38ef7d 100%)'
      background: 'linear-gradient(-15deg, rgba(0,128,128,1) 0%, rgba(46,204,64,1) 100%)'
      //background: 'linear-gradient(-15deg, #2ECC40 0%, #A9D16F 100%)'
    },
    statusBooked: {
    	//backgroundColor: '#FF4136'
      background: 'linear-gradient(top, #ea384d, #D31027)'
    },
});