import React from "react";
import { StyleSheet, css } from 'aphrodite';


export default class Add extends React.Component {

	constructor(props) {
    	super(props);
    	this.state = {
    		name: '',
    		floor_num: undefined,
    		message: ''
    	}

    	this.call_api = this.call_api.bind(this);
    }

	call_api() {

		if (this.state.floor_num === undefined) {
			this.setState({message: 'Необходимо задать этаж'})
			return;
		}

		if (this.state.name === undefined) {
			this.setState({message: 'Необходимо задать название'})
			return;
		}


		this.props.api.post('/rooms',
			JSON.stringify({
				name: this.state.name,
				floor_num: this.state.floor_num
			}))
		.then(((response) => {
			console.log(response);

			if (response.status === 201) {
				this.setState({message: "Переговорная создана"})
			}
		}).bind(this))
		.catch((error) => {
			console.log(error);

			if (error.response.status === 400) {
				if (error.response.data === 'room already exists') {
					this.setState({message: 'Переговорная с таким названием уже существует'})
				}
			}
		})
	}

	render() {
		return (
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<input 
					className={css(styles.input)}
					type="text" 
					placeholder="Название"
					value={this.state.name}
					onChange={(event) => this.setState({name: event.target.value})}
				/>
				<input
					className={css(styles.input)}
					type="number"
					placeholder="Этаж"
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