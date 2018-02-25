import React from "react";
import { StyleSheet, css } from 'aphrodite';
import {get_string} from "./date";


var Datetime = require('react-datetime');

export default class BookForm extends React.Component {
	
	constructor(props) {
    	super(props);
    	this.state = {
    		title: '',
    		desc: '',
    		startTime: this.props.defaultTime,
    		endTime: this.props.defaultTime,
    		room: this.props.rooms[0].id,
    		message: '',
    		successBooked: false,
    	};
    	this.handleChangeTitle = this.handleChangeTitle.bind(this);
    	this.handleChangeTime = this.handleChangeTime.bind(this);
    	this.handleChangeDesc = this.handleChangeDesc.bind(this);
    	this.handleSelection = this.handleSelection.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeTitle(event) {
    	this.setState({title: event.target.value});
    }

    handleSelection(event) {
    	console.log(event.target.value);
    	this.setState({room: event.target.value});
    }

    handleSubmit(event) {

    	console.log(this.state.room);

    	if (this.state.title === '') {
    		this.setState({message: 'Необходимо задать название'});
    		return;
    	}

    	if (this.state.startTime >= this.state.endTime) {
    		console.log("wrong time");
    		this.setState({message: 'Время задано неверно'});
    		return;
    	}

    	this.props.api.post('/events',
    		JSON.stringify({
    			title: this.state.title,
    			description: this.state.desc,
    			begin: get_string(this.state.startTime),
    			end: get_string(this.state.endTime),
    			room_id: this.state.room
    		}))
    	.then(((response) => {
    		console.log(response);

    		if (response.status === 201) {
    			this.props.update_events();
    			this.setState({message:'', successBooked: true});
    		}
    	}).bind(this))
    	.catch(((error) => {
    		console.log(error);

    		if (error.response.status === 400) {
    			if (error.response.data === "time unavailable") {
    				this.setState({message: "Заданное время недоступно для бронирования"})
    			}
    		}
    	}).bind(this))
	}

	handleChangeTime(num, moment) {

		console.log(moment);

	  	try {
	  		var date = moment.toDate();
	  	} catch (TypeError) {
	  		return;
	  	}

	  	if (num === 0) {
	  		this.setState({
				startTime: date
			});
	  	} else {
	  		this.setState({
				endTime: date
			});
	  	}
	}

	handleChangeDesc(event) {
		this.setState({desc: event.target.value});
	}

    render() {

    	if (this.state.successBooked) {
    		/*setTimeout(() => this.setState({
    			successBooked: false,
    			message: '', title: '', description: '',
    			startTime: this.props.defaultTime,
    			endTime: this.props.defaultTime,
    			room: this.props.rooms[0].id
    		}), 3000);*/
    		setTimeout(this.props.close, 3000);
    	}

    	console.log(111);
    	console.log(this.props.rooms);
    	console.log(this.state.room);
    	console.log(this.props.rooms.filter((room) => room.id == this.state.room));

    	return (
    	<div >

    		{this.state.successBooked ? 

    		<div style={{color: 'green', fontSize: '12pt', textAlign:'center'}}>
    			<b>Переговорная {this.props.rooms.filter((room) => room.id == this.state.room)[0].name} успешно забронировано
    			</b>
    		</div>

    		:

    		<div className={css(styles.bookingContainer)}>

	    		<button className={css(styles.closeButton)}
	    			onClick={this.props.close}>
	    			Закрыть
	    		</button>

	    		<select onChange={this.handleSelection} 
	    			style={{marginTop: 10, marginBottom: 20, height: 30, fontWeight: 'bold', fontSize: '10pt', backgroundColor: 'white', border: '1px solid #DDDDDD'}}>
	    			{this.props.rooms.map((room, i) => 
	    				i === 0 ?
	    				<option value={room.id} key={i} selected="selected">
	    					{room.floor_num} этаж - переговорная {room.name}
	    				</option>
	    				:
	    				<option value={room.id} key={i}>
	    					{room.floor_num} этаж - переговорная {room.name}
	    				</option>
	    			)}
	    		</select>

				<input 
					type="text" 
					value={this.state.title} 
					onChange={this.handleChangeTitle} 
					placeholder={"Название"}
					style={{padding: 5, width: '100%', margin: 'auto', borderRadius: '.25rem', border: '1px solid #DDDDDD'}}
				/>

		        <div style={{margin: 10, width:'90%', fontSize: '10pt'}}><b>Начало</b></div>

		        <div className={css(styles.datetime)} >
		          <Datetime locale="ru" 
		            defaultValue={this.props.defaultTime} 
		            onChange={(moment) => this.handleChangeTime(0, moment)} 
		            inputProps={{ placeholder: 'N/A', disabled: false }}
		            viewMode='time'
		            timeFormat={'HH:mm'}
		            renderInput={(props, open, close) => {
		                return <input style={{textAlign: 'center'}} {...props} />;
		            }}/>
		        </div> 

		        <div style={{margin: 10, width:'90%', fontSize: '10pt'}}><b>Конец</b></div>

		        <div className={css(styles.datetime)} >
		          <Datetime locale="ru" 
		            defaultValue={this.props.defaultTime} 
		            onChange={(moment) => this.handleChangeTime(1, moment)} 
		            inputProps={{ placeholder: 'N/A', disabled: false }}
		            viewMode='time'
		            timeFormat={'HH:mm'}
		            renderInput={(props, open, close) => {
		                return <input style={{textAlign: 'center'}} {...props} />;
		            }}/>
		        </div>

		        <textarea className={css(styles.textarea)}
		        	onChange={this.handleChangeDesc} 
		        	placeholder={"Описание"}
		        	style={{marginTop: 20, marginBottom: 10, width: '100%'}}
		        />

		        <div style={{height: 20, color: 'red', marginBottom: 30, textAlign: 'center'}}>{this.state.message}</div>

		        <button 
		        	className={css(styles.submit)} 
		        	onClick={this.handleSubmit}>
		        	<b>{"Забронировать"}</b>
		        </button>

	        </div>
    		}

    		
    	</div>);
    }
}

var styles = StyleSheet.create({

	bookingContainer: {
		display: 'flex', 
		flexDirection: 'column', 
		alignItems: 'center', 
		padding: 15, 
		backgroundColor: 'white', 
		margin: 10, 
		borderRadius: '15px'
	},
	datetime: {
		width: '100%',
	},
	closeButton: {
		marginLeft: 'auto', 
		marginRight: 'auto',
		marginBottom: 20,
		width: 84, 
		border: '1px solid #DDDDDD',
		borderRadius: '5px',
 	},
 	textarea: {
 		border: '1px solid #DDDDDD',
		borderRadius: '.25rem',
		padding: 5
 	},
 	submit: {
 		fontSize: '12pt',
	    marginRight: 'auto',
	    marginLeft: 'auto',
	    width: 170,
	    height: 40,
	    borderRadius: '15px',
	    letterSpacing: '1px',
	    background: 'linear-gradient(10deg, #26d0ce, #1a2980)',
	    color: 'white'
 	}
});