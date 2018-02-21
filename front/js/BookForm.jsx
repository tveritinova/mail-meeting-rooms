import React from "react";
import { StyleSheet, css } from 'aphrodite';

require('../node_modules/react-datetime/css/react-datetime.css');

var Datetime = require('react-datetime');

export default class BookForm extends React.Component {
	
	constructor(props) {
    	super(props);
    	this.state = {
    		titke: '',
    		desc: '',
    		startTime: this.props.defaultTime,
    		endTime: this.props.defaultTime,
    		room: undefined
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
    	this.setState({room: event.target.value});
    }

    handleSubmit(event) {

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
    	return (
    	<div className={css(styles.bookingContainer)}>

    		<button className={css(styles.closeButton)}
    			onClick={this.props.close}>
    			Закрыть
    		</button>

    		<select onChange={this.handleSelection} 
    			style={{marginTop: 10, marginBottom: 20, height: 30, fontWeight: 'bold', fontSize: '10pt', backgroundColor: 'white', border: '1px solid #DDDDDD'}}>
    			{this.props.rooms.map((room, i) => 
    				<option value={room.id} key={i}>{room.floor_num} этаж - переговорная {room.name}</option>
    			)}
    		</select>

			<input 
				type="text" 
				value={this.state.value} 
				onChange={this.handleChange} 
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
	            renderInput={(props, open, close) => {
	                return <input style={{textAlign: 'center'}} {...props} />;
	            }}/>
	        </div>

	        <textarea className={css(styles.textarea)}
	        	onChange={this.handleChangeDesc} 
	        	placeholder={"Описание"}
	        	style={{marginTop: 20, marginBottom: 20, width: '100%'}}
	        />

	        <button 
	        	className={css(styles.submit)} 
	        	onClick={this.handleSubmit}>
	        	<b>{"Забронировать"}</b>
	        </button>

    		
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