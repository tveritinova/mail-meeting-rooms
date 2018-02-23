// App.jsx
import React from "react";
import BookForm from "./BookForm";
import FloorsTable from "./FloorsTable";
import { StyleSheet, css } from 'aphrodite';
import BigCalendar from 'react-big-calendar'
import moment from 'moment';
import {get_string_date} from "./date";
import {rooms} from "./rooms_data.js";
import Sticky from 'react-sticky-el';
import Modal from 'react-overlays/lib/Modal';
import LoginForm from './LoginForm';


BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))


var Datetime = require('react-datetime');

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    	selected_now: true,
    	selected_time: new Date(),
    	selected_room: undefined,
      rooms: undefined,
      floors: undefined,
      book: false,
      showLogin: false
    };
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
  }

  componentWillMount() {
    // replace with ajax request

    this.setState({
      rooms: rooms
    },
    function () {
      console.log('set state callback');
      console.log(this.state.rooms);
      this.get_floors();
    });

  }

  get_floors() {

    console.assert(this.state.rooms);

    var res = new Set();

    for (var i=0; i < this.state.rooms.length; i++) {
      res.add(this.state.rooms[i].floor_num); 
    }

    console.log('result set', res);

    this.setState({
      floors: Array.from(res).sort((a,b) => b-a)
    });

  }

  get_name_for_room(id) {
    return this.state.rooms.filter((room) => room.id === id)[0].name;
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
  	console.log(moment);

  	try {
  		var date = moment.toDate();
  	} catch (TypeError) {
  		return;
  	}
  	this.setState({
  		selected_time: date
  	});
  }

  handleRoomClick(room) {
  	console.log('this', this);
  	this.setState({
  		selected_room: room
  	});
  }

  get_events(room_id) {
    console.log(rooms, room_id);
    if (this.state.rooms) {
      return this.state.rooms.filter((room) => room.id === room_id)[0].events;
    }
  }


  CustomToolbar(toolbar) {

  	const goToBack = () => {
  		toolbar.date.setDate(toolbar.date.getDate() - 1);
  		toolbar.onNavigate('prev');
  	};

  	const goToNext = () => {
  		toolbar.date.setDate(toolbar.date.getDate() + 1);
  		toolbar.onNavigate('next');
  	};

  	const goToCurrent = () => {
  		const now = new Date();
      toolbar.date.setDate(now.getDate());
  		toolbar.date.setMonth(now.getMonth());
  		toolbar.date.setYear(now.getFullYear());
  		toolbar.onNavigate('current');
  	};

  	const label = () => {
  		const date = moment(toolbar.date);
  		return (
  		  <p>{date.format('DD')} {date.format('MMMM')} {date.format('YYYY')}</p>
  		);
  	};

  	return (
  		<div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 5}}>
  		    {label()}

  		    <div>
  			    <button onClick={goToBack}>&#8249;</button>
  			    <button onClick={goToCurrent}>today</button>
  			    <button onClick={goToNext}>&#8250;</button>
  		    </div>
  		</div>
  	);
  };

  render () {
  	console.log(this.state.selected_now);
  	var current;
  	if (this.state.selected_now){
  		current = new Date();
  	} else {
  		current = this.state.selected_time;
  	}

  	console.log('selected_time', this.state.selected_time);
  	console.log('selected_room', this.state.selected_room);

    if (!this.state.selected_now) {
      var datePicker = 
        <div className={css(styles.datetime)} >
          <Datetime locale="ru" 
            defaultValue={this.state.selected_time} 
            onChange={this.handleChangeTime} 
            inputProps={{ placeholder: 'N/A', disabled: false }}
            viewMode='time'
            renderInput={(props, open, close) => {
                return <input style={{textAlign: 'center'}} {...props} />;
            }}/>
        </div> 
    }

    if (this.state.selected_room) {
      var calendar = 
        <div className={css(styles.calendarContainer)}>

          <p className={css(styles.calendarLabel)}>Занятость переговорки <b>{this.get_name_for_room(this.state.selected_room)}</b></p>

          <BigCalendar className={css(styles.calendar)}   
            events={this.get_events(this.state.selected_room)} 
            showMultiDayTimes 
            defaultView='day' 
            defaultDate={this.state.selected_time}
            scrollToTime={this.state.selected_time}
            views={['day']}
            step={30}
            components={{toolbar:this.CustomToolbar}}
          />

          <button className={css(styles.closeButton)}
            onClick={()=>{this.setState({selected_room: undefined})}}>
            Закрыть
          </button>

        </div> 
    }

    const modalStyle = {
      position: 'fixed',
      zIndex: 1040,
      top: 0, bottom: 0, left: 0, right: 0,
    };

    const backdropStyle = {
      position: 'fixed',
      zIndex: 1040,
      top: 0, bottom: 0, left: 0, right: 0,
      zIndex: 'auto',
      backgroundColor: '#000',
      opacity: 0.5
    };

    const dialogStyle = {
      position: 'absolute',
      width: 400,
      top: 50 + '%', left: 50 + '%',
      transform: `translate(-${50}%, -${50}%)`,
      border: '1px solid #e5e5e5',
      backgroundColor: 'white',
      boxShadow: '0 5px 15px rgba(0,0,0,.5)',
      padding: 20,
      borderRadius: '10px'
    };

    return (

      <div className={css(styles.body)}>

        <div className={css(styles.header)}>
          <button onClick={()=>this.setState({showLogin: true})}>Войти</button>

          <Modal 
            show={this.state.showLogin}
            onHide={() => this.setState({showLogin: false})}
            style={modalStyle}
            backdropStyle={backdropStyle}
          >

            <div style={dialogStyle}>
              <LoginForm/>
            </div>

          </Modal>

        </div>

      	<div className={css(styles.mainContainer)}>

      		<div className={css(styles.left)}>
            {calendar && <Sticky>{calendar}</Sticky>}
          </div>

          { !this.state.rooms ?

          <div className={css(styles.center)}/>
          :
      		<div className={css(styles.center)}>

            <Sticky>
              <div style={{backgroundColor: '#e4e9f4', padding: 20, boxShadow: '0px 0px 15px 2px #e4e9f4'}}>
      	    		<div className={css(styles.setTime)}>
      	    			<input className={css(styles.checkboox)} 
      	    				type="checkbox" onChange={this.handleChangeCheckbox} 
      	    				defaultChecked={this.state.selected_now}/> 

      	    			<div className={css(styles.nowLabel)}>Сейчас</div>
      	    		</div>

      	    		{datePicker}

      	    		<div className={css(styles.statusLabel)}>
      	    			Состояние переговорок на <b>{get_string_date(this.state.selected_time, new Date())}</b> 
      	    		</div>
              </div>
            </Sticky>

  	    		{ this.state.floors && 
              <FloorsTable 
                floors={this.state.floors} 
                rooms={this.state.rooms}
                selected_room={this.state.selected_room}
                current={current}
                handleRoomClick={this.handleRoomClick.bind(this)}
              /> }

  	    	</div>
          }


      		<div className={css(styles.right)}>

            <Sticky>
              {this.state.book ? 
                <BookForm 
                  defaultTime={this.state.selected_time}
                  close={() => this.setState({book: false}).bind(this)}
                  rooms={this.state.rooms.sort((a, b) => (+a.floor_num) - (+b.floor_num))}
                />
              :
                <div className={css(styles.bookButtonContainer)}>

                  <button className={css(styles.bookButton)}
                    onClick={() => this.setState({book: true})}>

                    <b>Забронировать</b>

                  </button>

                </div> 
              }
            </Sticky>

          </div>
      		
      	</div>

      </div>

    );
  }
}


const styles = StyleSheet.create({

  body :{
    display: 'flex',
    flexDirection: 'column',
  },

  header: {
    width: '100%',
    height: 50,
    backgroundColor: '#e4e9f4',
    textAlign: 'center',
    fontSize: '20pt',
    fontWeight: 'bold'
  },

	mainContainer: {
		display: 'flex',
		flexDirection: 'row',
		//height: '100%',
    width: '100%',
	},

	left: {
		width: '25%',
		height: '100%',
	},

	center: {
		width: '50%',
		height: '100%',
    //display: 'flex',
    //flexDirection: 'column',
    //alignItems: 'center',
    //justifyContent: 'flex-start'
	},

	right: {
		width: '25%',
    
	},

  setTime: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 100,
    //marginTop: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  datetime: {
  	width: 250,
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
  	height: 400,
    width: '85%',
    marginTop: 20,
    marginBottom: 10,
  },
  statusLabel: {
  	textAlign: 'center',
  	marginTop: 20,
  	//marginBottom: 20,
    fontSize: '11pt',
  },
  closeButton: {
  	marginLeft: 'auto', 
  	marginRight: 'auto',
  	marginTop: 20,
  	marginBottom: 20,
  	width: 84, 
  	border: '1px solid #DDDDDD',
  	borderRadius: '5px',
  },
  
  calendarContainer: {
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    padding: 15, 
    backgroundColor: 'white', 
    margin: 10, 
    borderRadius: '15px'
  },
  calendarLabel: {
    fontSize: '11pt', 
    borderBottom: '1px solid #DDDDDD',
    marginTop: 10
  },
  bookButton: {
    fontSize: '15pt',
    marginTop: 50,
    marginRight: 50,
    width: 220,
    height: 50,
    letterSpacing: '1px',
    borderRadius: '15px',
    //background: 'linear-gradient(20deg, #fc5c7d, #6a82fb)',
    //color: 'white'
    
    //background: 'linear-gradient(20deg, #0f0c29, #302b63, #24243e)',
    //color: 'white'

    background: 'linear-gradient(10deg, #26d0ce, #1a2980)',
    color: 'white'

  },
  bookButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  
});