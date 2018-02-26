import React from "react";
import { StyleSheet, css } from 'aphrodite';


var qs = require('qs');

export default class LoginForm extends React.Component {

	constructor(props) {
    	super(props);
    	this.state = {
    		email: '',
    		password: '',
    		//remember: false,
    		redirect: false,
    		message: ''
    	};

    	this.handleChangeEmail = this.handleChangeEmail.bind(this);
    	this.handleChangePassword = this.handleChangePassword.bind(this);
    	//this.handleChangeRemember = this.handleChangeRemember.bind(this);
    	this.handleLogin = this.handleLogin.bind(this);
    }



    handleLogin() {
    	this.props.api.post('/login',
    	JSON.stringify({
    		email: this.state.email,
    		password: this.state.password
		}))
		.then((function (response) {


			if (response.status == 200) {
				this.props.set_user(
					response.data.first_name,
					response.data.last_name,
					response.data.id,
					response.data.is_admin,
					response.data.token
				);

				localStorage.setItem('token_auth', response.data.token);

				this.props.redirect();
			}
	    }).bind(this))
		.catch((function (error) {

			if (error.response.status === 401) {
				if (error.response.data === "wrong password") {
					this.setState({message: "Неверный пароль"});
				}

				if (error.response.data === "no user") {
					this.setState({message: "Почта задана неверно"});
				}

				if (error.response.data === "not confirmed") {
					this.setState({message: "Необходимо подтверждение регистрации"});
				}
			}
		}).bind(this));
	}

	handleChangeEmail(event) {
		this.setState({email: event.target.value})
	}

	handleChangePassword(event) {
		this.setState({
			password: event.target.value
		});
	}

	/*handleChangeRemember(event) {
		this.setState({remember: !this.state.remember});
	}*/

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

    			<button
    				onClick={this.props.register}
    				className={css(styles.register)}
    			>
    				Регистрация
    			</button>

    			<div style={{height: 20, color: 'red', marginTop: 10}}>{this.state.message}</div>

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
		fontSize: '10pt',
		padding: 5, 
		borderRadius: '.25rem', 
		border: '1px solid #DDDDDD'
	},
	loginButton: {
		backgroundColor: '#06397d',
		color: 'white',
		marginTop: 10,
		width: '30%',
		height: 30,
		fontSize: '12pt',
		borderRadius: '5px'
	},
	register: {
		fontSize: '10pt', 
		borderBottom: '1px dashed #BBBBBB !important',
		padding: 0,
		':hover': {
			borderBottom: '1px dashed black !important',
		},
		marginTop: 5
	}
});