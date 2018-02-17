// App.jsx
import React from "react";
import Room from "./Room"
import { StyleSheet, css } from 'aphrodite';
import BigCalendar from 'react-big-calendar'
import moment from 'moment';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

var Datetime = require('react-datetime');

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    	selected_now: true,
    	selected_time: new Date(),
    	selected_room: undefined
    };
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
  }


  handleChangeCheckbox(event) {
  	var last = this.state.selected_now;
  	this.setState({
  		selected_now: !last
  	});

  	if (!last) {
  		this.setState({
  			selected_time: new Date()
  		});
  	}
  }
  

  handleChangeTime(moment) {
  	this.setState({
  		selected_time: moment.toDate()
  	});
  }

  handleRoomClick(room) {
  	console.log(room);
  	this.setState({
  		selected_room: room
  	});
  }

  getStringFromDate(date) {
  	return date.getHours()+':'+date.getMinutes()+' '+date.getDate()+'.'
  }

  render () {
  	console.log(this.state.selected_now);
  	var current;
  	if (this.state.selected_now){
  		current = new Date();
  	} else {
  		current = this.state.selected_time;
  	}

  	// get with api
  	var events_arrays = [
  	[
  		{
  			start: new Date(2018,1,16,18,0,0),
  			end: new Date(2018,1,16,19,0,0),
  			title: 'Event 1'
  		},
  		{
  			start: new Date(2018,1,16,23,0,0),
  			end: new Date(2018,1,17,1,0,0),
  			title: 'Event 2',
  		},
  		{
  			start: new Date(2018,1,17,10,0,0),
  			end: new Date(2018,1,17,13,0,0),
  			title: 'Event 3',
  		},
  		{
  			start: new Date(2018,1,17,15,0,0),
  			end: new Date(2018,1,17,17,0,0),
  			title: 'Event 4',
  		}
  	],
  	[
  		{
  			start: new Date(2018,1,16,22,20,0),
  			end: new Date(2018,1,16,23,0,0)
  		},
  		{
  			start: new Date(2018,1,16,23,0,0),
  			end: new Date(2018,1,17,1,50,0),
  		}
  	]];

  	console.log('selected_time', this.state.selected_time);
  	console.log('selected_room', this.state.selected_room);
  	console.log('events', events_arrays[this.state.selected_room]);

    return (
    	<div>
    		<div className={css(styles.setTime)}>
    			<input className={css(styles.checkboox)} type="checkbox" onChange={this.handleChangeCheckbox} defaultChecked={this.state.selected_now}/> 
    			<div className={css(styles.nowLabel)}>Сейчас</div>
    		</div>
    		{!this.state.selected_now ? 
    		<div className={css(styles.datetime)} >
    			<Datetime locale="ru" defaultValue={this.state.selected_time} onChange={this.handleChangeTime}/>
    		</div> : ''}
    		<div>Состояние переговорок на {this.getStringFromDate(this.state.selected_time)} </div>

    		{events_arrays.map((events, i) => 
    			<div className={this.state.selected_room === i ? 
    								css(styles.room, styles.selected_room) : 
    								css(styles.room)}
    				onClick={()=>this.handleRoomClick(i)} key={i}>
	    			<Room name={i+1} current={current} events={events_arrays[i]}/>
	    		</div>)}

    		{this.state.selected_room !== undefined ?
    		<BigCalendar className={css(styles.calendar)}
    		   	events={events_arrays[this.state.selected_room]} 
    			showMultiDayTimes 
    			defaultView='day' 
    			defaultDate={this.state.selected_time}
    			scrollToTime={this.state.selected_time}
    			views={['day']}
    			step={30}
    		/> : ''}
    	</div>);
  }
}


const styles = StyleSheet.create({
    setTime: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 100,
        marginTop: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    datetime: {
    	width: 300,
    	marginLeft: 'auto',
    	marginRight: 'auto',
    	marginTop: 20,
    },
    nowLabel: {
    	order:1,
    	marginLeft: 5,
    },
    checkbox: {
    	order: 0
    },
    calendar: {
    	width: 600,
    	height: 500,
    	marginLeft: 'auto',    	
    	marginRight: 'auto',
    	marginTop: 20,
    },
    room: {
    	width: 200,
    	marginRight: 'auto',
    	marginLeft: 'auto',
    	marginTop: 20,
    	marginBottom: 20,
    	borderRadius: '7px',
    	backgroundColor: 'rgb(230,230,230)',
    },
    selected_room: {
    	border: '2px solid black'
    }
});