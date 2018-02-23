import React from "react";
import { StyleSheet, css } from 'aphrodite';
import axios from 'axios';

var passwordHash = require('password-hash');

export default class LoginForm extends React.Component {

	constructor(props) {
    	super(props);
    	this.state = {
    		email: '',
    		password: '',
    		remember: false,
    		api: axios.create({
				baseURL: 'http://34.216.197.100',
				timeout: 10000,
				transformRequest: [(data) => data],
				headers: {
					'Accept': 'application/json,*/*',
					'Content-Type': 'application/json',
				}
	    	})
    	};

    	this.handleChangeEmail = this.handleChangeEmail.bind(this);
    	this.handleChangePassword = this.handleChangePassword.bind(this);
    	this.handleChangeRemember = this.handleChangeRemember.bind(this);
    	this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin() {
    	console.log(this.state);
    	console.log(passwordHash.generate(this.state.password));
    	this.state.api.post('/users',
    	{
    		//email: this.state.email,
    		//password: passwordHash.generate(this.state.password)
    		hello: 'there'
    	})
    	.then(function (response) {
			console.log(response);
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	handleChangeEmail(event) {
		this.setState({email: event.target.value})
	}

	handleChangePassword(event) {
		this.setState({
			password: event.target.value
		});
	}

	handleChangeRemember(event) {
		this.setState({remember: !this.state.remember});
	}

	render() {
		return (
			<div className={css(styles.formContainer)}>
				<input
					type="text"
					placeholder={"Эл. почта"}
					className={css(styles.input)}
					value={this.state.email}
					onChange={this.handleChangeEmail}
				/>

				<input
					type="password"
					placeholder={"Пароль"}
					className={css(styles.input)}
					value={this.state.password}
					onChange={this.handleChangePassword}
				/>

				<input
    				type="checkbox" 
    				onChange={this.handleChangeRemember} 
    				defaultChecked={this.state.remember}/> 

				<button
					className={css(styles.loginButton)}
					onClick={this.handleLogin}
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