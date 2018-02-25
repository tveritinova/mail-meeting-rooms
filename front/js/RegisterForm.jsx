import React from "react";
import { StyleSheet, css } from 'aphrodite';
import Overlay from 'react-overlays/lib/Overlay';
import { findDOMNode } from 'react-dom';


export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    	first_name: '',
    	last_name: '',
    	email: '',
    	email_again: '',
    	password: '',
    	password_again: '',
    	showEmailOverlay: false,
    	message: '',
    	messageConfirm: true
    };

    this.register = this.register.bind(this);
  }

  register() {

  	console.log("register");

  	if (this.state.email === '') {
  		this.setState({message: "Необходимо ввести почту"});
  		return;
  	}

  	if (this.state.password === '') {
  		this.setState({message: "Необходимо ввести пароль"});
  		return;
  	}

  	if (this.state.first_name === '') {
  		this.setState({message: "Необходимо ввести имя"});
  		return;
  	}

  	if (this.state.last_name === '') {
  		this.setState({message: "Необходимо ввести фамилию"});
  		return;
  	}

  	if (this.state.email !== this.state.email_again) {
  		this.setState({message: "Почты не совпадают"});
  		return;
  	}

	if (this.state.password !== this.state.password_again) {
  		this.setState({message: "Пароли не совпадают"});
  		return;
  	}

  	this.props.api.post('/users',
    	JSON.stringify({
    		first_name: this.state.first_name,
    		last_name: this.state.last_name,
    		email: this.state.email,
    		password: this.state.password
	}))
	.then((function (response) {
		console.log(response);

		if (response.status === 201) {
			if (response.data === "user created") {
				this.setState({messageConfirm: true});
			}
		}

	}).bind(this))
	.catch((function (error) {
		console.log(error);

		if (error.response.status === 400) {
			if (error.response.data === "user already exists") {
				this.setState({message: "Пользователь с такой эл. почтой уже зарегистрирован"})
			}

			if (error.response.data === "email invalid") {
				this.setState({message: "Эл. почта недействительна"})
			}
		}
	}).bind(this));
  }

  render() {

  	return (
  		<div>

  			{this.state.messageConfirm ? 
  				<div className={css(styles.formContainer)}>
  					<div style={{fontSize: '11pt', textAlign: 'center', marginBottom: 15}}>
  						На вашу почту отправлено письмо со ссылкой на подтверждение регистрации
  					</div>

  					<button onClick={this.props.login}
  						className={css(styles.loginButton)}
  					>
  						Войти
  					</button>
  				</div>
  			:
  			<div className={css(styles.formContainer)}>
	  			<input
					type="text"
					placeholder={"Имя"}
					className={css(styles.input)}
					value={this.state.first_name}
					onChange={(event) => this.setState({first_name: event.target.value})}
				/>

				<input
					type="text"
					placeholder={"Фамилия"}
					className={css(styles.input)}
					value={this.state.last_name}
					onChange={(event) => this.setState({last_name: event.target.value})}
				/>

				<input
					type="text"
					placeholder={"Эл. почта"}
					className={css(styles.input)}
					value={this.state.email}
					onChange={(event) => this.setState({email: event.target.value})}
				/>

				<input
					type="text"
					placeholder={"Эл. почта еще раз"}
					className={css(styles.input)}
					value={this.state.email_again}
					onChange={(event) => this.setState({email_again: event.target.value})}
					ref={(c) => {this.target = c;}}
				/>

				<input
					type="password"
					placeholder={"Пароль"}
					className={css(styles.input)}
					value={this.state.password}
					onChange={(event) => this.setState({password: event.target.value})}
				/>

				<input
					type="password"
					placeholder={"Пароль еще раз"}
					className={css(styles.input)}
					value={this.state.password_again}
					onChange={(event) => this.setState({password_again: event.target.value})}
				/>

				<div style={{height: 20, color: 'red'}}>{this.state.message}</div>

				<button
					className={css(styles.registerButton)}
					onClick={this.register}
				>
					Зарегистрироваться
				</button>
			</div>
			}
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
		border: '1px solid #DDDDDD',
	},
	registerButton: {
		backgroundColor: '#06397d',
		color: 'white',
		marginTop: 20,
		width: '65%',
		height: 30,
		fontSize: '12pt',
		borderRadius: '5px'
	},
	loginButton: {
		marginTop: 20,
		width: '30%',
		height: 30,
		fontSize: '12pt',
		borderRadius: '5px',
		border: '1px solid #DDDDDD !important'
	}
});