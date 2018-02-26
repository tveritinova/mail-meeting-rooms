import React from "react";
import { StyleSheet, css } from 'aphrodite';


export default class Delete extends React.Component {

	constructor(props) {
    	super(props);
    	this.state = {
    		room: this.props.rooms[0].id,
    		message: '',
    		close: false
    	}

    	this.call_api = this.call_api.bind(this);
    }

	call_api() {
		this.props.api.delete('/rooms/'+this.state.room)
		.then(((response) => {

			if (response.status == 200) {
				this.setState({message: "Удалено", close: true})
			}
		}).bind(this))
		.catch((error) => {
		})
	}

	render() {

		if (this.state.close) {
    		setTimeout(this.props.close, 1000);
    	}

		return (
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<select onChange={(event) => this.setState({room: event.target.value})} 
	    			style={{marginTop: 10, marginBottom: 5, height: 30, fontWeight: 'bold', fontSize: '10pt', backgroundColor: 'white', border: '1px solid #DDDDDD'}}>
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

	    		<div style={{height: 20, textAlign: 'center'}}><u>{this.state.message}</u></div>

	    		<button onClick={this.call_api} className={css(styles.button)}>Удалить</button>
			</div>
		)
	}
}

var styles = StyleSheet.create({
	input: {
		margin: 10,
		width: '85%',
		fontSize: '10pt',
		padding: 5, 
		borderRadius: '.25rem', 
		border: '1px solid #DDDDDD'
	},
	button: {
		backgroundColor: '#06397d',
		color: 'white',
		marginTop: 20,
		width: '50%',
		height: 30,
		fontSize: '12pt',
		borderRadius: '5px'
	},
});