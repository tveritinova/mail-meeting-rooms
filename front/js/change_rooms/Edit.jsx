import React from "react";
import { StyleSheet, css } from 'aphrodite';



export default class Edit extends React.Component {

	constructor(props) {
    	super(props);
    	this.state = {
    		room: this.props.rooms[0].id,
    		message: '',
    		name: '',
    		floor_num: undefined
    	}

    	this.call_api = this.call_api.bind(this);
    }

	call_api() {

		if (this.state.floor_num === undefined) {
			this.setState({message: "Необходимо задать этаж"});
			return;
		}

		this.props.api.put('/rooms/'+this.state.room,
			JSON.stringify({
				name: this.state.name,
				floor_num: this.state.floor_num
			})
		)
		.then(((response) => {
			console.log(response);

			if (response.status == 200) {
				this.setState({message: "Успешно измненено"})
			}
		}).bind(this))
		.catch(((error) => {
			console.log(error);

			if (error.response.status == 400) {
				if (error.response.data === 'room already exists'){
					this.setState({message: "Переговорная с таким названием уже существует"})
				}
			}
		}).bind(this))
	}

	render() {
		return (
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<select onChange={(event) => this.setState({room: event.target.value})} 
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
					className={css(styles.input)}
					type="text" 
					placeholder="Название"
					onChange={(event) => this.setState({name: event.target.value})}
				/>
				<input 
					className={css(styles.input)}
					type="number" 
					placeholder="Этаж"
					value={this.state.floor_num}
					onChange={(event) => this.setState({floor_num: event.target.value})}
				/>
				<div style={{height: 20, textAlign: 'center'}}><u>{this.state.message}</u></div>
				<button onClick={this.call_api} className={css(styles.button)}>Создать</button>
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