import React from "react";
import BookForm from "./BookForm";
import FloorsTable from "./FloorsTable";
import { StyleSheet, css } from 'aphrodite';
import BigCalendar from 'react-big-calendar'
import moment from 'moment';
import {get_string_date} from "./date";
import Sticky from 'react-sticky-el';
import axios from 'axios';
import 'whatwg-fetch';
import {Redirect} from 'react-router-dom';
import Add from "./change_rooms/Add";
import Delete from "./change_rooms/Delete";
import Edit from "./change_rooms/Edit";



BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))


var Datetime = require('react-datetime');

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    	selected_now: true,
    	selected_time: new Date(),
    	selected_room: undefined,
      rooms: undefined,
      floors: undefined,
      book: false,
      showLogin: false,
      showRegister: false,
      refresh: false,
      admin_add: false,
      admin_delete: false,
      admin_update: false
    };
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.get_rooms = this.get_rooms.bind(this);
  }

  get_rooms() {
    this.props.api.get('/rooms')
    .then(((response) => {

      this.setState({
        rooms: response.data.map((room) => {
          room.events = room.events.map((event) => {return{
            start: new Date(event.begin.replace(/-/g, "/")),
            end: new Date(event.end.replace(/-/g, "/")),
            title: event.title,
            desc: event.description
          }}).sort((a,b) => a.start.getTime() >= b.start.getTime())
          return room
        })
      },
      function () {
        this.get_floors();
      });

    }).bind(this))
    .catch((error) => {
    })
  }

  componentWillMount() {
    this.get_rooms();
  }

  get_floors() {

    console.assert(this.state.rooms);

    var res = new Set();

    for (var i=0; i < this.state.rooms.length; i++) {
      res.add(this.state.rooms[i].floor_num); 
    }

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
  	this.setState({
  		selected_room: room
  	});
  }

  get_events(room_id) {
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

  	var current;
  	if (this.state.selected_now){
  		current = new Date();
  	} else {
  		current = this.state.selected_time;
  	}

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


    if (this.state.refresh) {
      return (<Redirect to="/"/>)
    }
    

    return (

      <div className={css(styles.body)}>

        <div className={css(styles.header)}>

          <div style={{fontSize: '16pt', width: '70%', fontFamily: 'Open Sans', textAlign: 'left'}}>
            <p>Портал бронирования переговорок в офисе <b>Mail.ru</b></p>
          </div>

          <div style={{fontSize: '10pt',width: '30%', fontFamily: 'Open Sans', textAlign: 'right'}}>
            <p>Вы вошли как <b>{this.props.user_first_name} {this.props.user_last_name}</b></p>

            <button
              className={css(styles.logoutButton)}
              onClick={() => {
                localStorage.removeItem('token_auth');
                this.setState({refresh: true});
              }}
            >
              Выйти
            </button>
          </div>

        </div>

      	<div className={css(styles.mainContainer)}>

      		<div className={css(styles.left)}>
            {this.props.user_is_admin &&
              <div className={css(styles.calendarContainer)}>
                Изменить переговорные:
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  <button className={css(styles.button)}
                    onClick={()=>this.setState({admin_add: true, admin_delete: false, admin_update: false})}>
                    Добавить
                  </button>
                  <button className={css(styles.button)}
                    onClick={()=>this.setState({admin_add: false, admin_delete: true, admin_update: false})}>
                    Удалить
                  </button>
                  <button className={css(styles.button)}
                    onClick={()=>this.setState({admin_add: false, admin_delete: false, admin_update: true})}>
                    Изменить
                  </button>
                </div>
                
                {this.state.admin_add && <Add api={this.props.api} close={()=>this.setState({admin_add: false})}/>}
                {this.state.admin_delete && <Delete api={this.props.api} rooms={this.state.rooms} close={()=>this.setState({admin_delete: false})}/>}
                {this.state.admin_update && <Edit api={this.props.api} rooms={this.state.rooms} close={()=>this.setState({admin_update: false})}/>}
              </div>
            }
            {calendar && <Sticky>{calendar}</Sticky>}
          </div>

          { !this.state.rooms ?

          <div className={css(styles.center)}/>
          :
      		<div className={css(styles.center)}>

            <Sticky>
              <div style={{backgroundColor: '#e4e9f4', padding: 10, boxShadow: '0px 0px 15px 2px #e4e9f4', fontFamily: 'Open Sans'}}>

                <div className={css(styles.statusLabel)}>
                  Состояние переговорок на <b>{get_string_date(this.state.selected_time, new Date())}</b> 
                </div>

      	    		<div className={css(styles.setTime)}>
      	    			<input className={css(styles.checkboox)} 
      	    				type="checkbox" onChange={this.handleChangeCheckbox} 
      	    				defaultChecked={this.state.selected_now}/> 

      	    			<div className={css(styles.nowLabel)}>Сейчас</div>
      	    		</div>

      	    		{datePicker}      	    		
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
                  rooms={this.state.rooms}
                  api={this.props.api}
                  update_events={this.get_rooms}
                />
              :
                <div className={css(styles.bookButtonContainer)}>

                  { this.state.rooms &&
                  <button className={css(styles.bookButton)}
                    onClick={() => this.setState({book: true})}>

                    <b>Забронировать</b>

                  </button>}

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
    alignItems: 'center'
  },

  header: {
    width: '95%',
    backgroundColor: '#e4e9f4',
    textAlign: 'center',
    fontSize: '20pt',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 15,
    paddingRight: 10,
    paddingLeft: 10,
    margin: 10,
    borderBottom: '1px solid #06397d'
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
  	marginTop: 10,
  },
  nowLabel: {
  	order:1,
  	//marginLeft: 5,
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
  	marginBottom: 15,
    fontSize: '14pt',
  },
  closeButton: {
  	marginLeft: 'auto', 
  	marginRight: 'auto',
  	marginTop: 20,
  	marginBottom: 20,
  	width: 75, 
  	border: '1px solid #DDDDDD',
  	borderRadius: '5px',
  },
  button: {
    marginLeft: 5, 
    marginRight: 5,
    marginTop: 20,
    marginBottom: 20,
    width: 75, 
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
    fontFamily: 'Open Sans',
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
  logoutButton: {
    fontSize: '10pt', 
    borderBottom: '1px dashed #BBBBBB !important',
    padding: 0,
    ':hover': {
      borderBottom: '1px dashed black !important',
    },
    marginTop: 5,
    backgroundColor: 'rgba(0,0,0,0) !important'
  }
});