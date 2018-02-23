import React from "react";
import { StyleSheet, css } from 'aphrodite';

var passwordHash = require('password-hash');

export default class LoginForm extends React.Component {

	constructor(props) {
    	super(props);
    	this.state = {
    		email: '',
    		passwordHashed: '',
    		remember: false,
    	};
    }

	render() {
		return (
			<div className={css(styles.formContainer)}>
				<input
					type="text"
					placeholder={"Эл. почта"}
					className={css(styles.input)}
					value={this.state.email}
					onChange={(event) => this.setState({email: event.target.value}).bind(this)}
				/>

				<input
					type="password"
					placeholder={"Пароль"}
					className={css(styles.input)}
					value={this.state.passwordHashed}
					onChange={(event) => this.setState({
						passwordHashed: passwordHash.generate(event.target.value)}).bind(this)}
				/>

				<input
    				type="checkbox" 
    				onChange={(event) => this.setState({remember: !this.state.remember}).bind(this)} 
    				defaultChecked={this.state.remember}/> 

				<button
					className={css(styles.loginButton)}
				>
					Войти
				</button>
			</div>
		)
	}
}

var styles = StyleSheet.create({
	formContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: 20,
	},
	input: {
		margin: 10,
		width: '85%',
		fontSize: '12pt'
	},
	loginButton: {
		backgroundColor: '#06397d',
		color: 'white',
		margin: 20,
		width: '30%',
		height: 30,
		fontSize: '12pt'
	}
});