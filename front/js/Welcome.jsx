import React from "react";
import LoginForm from './LoginForm';
import RegisterForm from "./RegisterForm";
import Modal from 'react-overlays/lib/Modal';
import { StyleSheet, css } from 'aphrodite';
import {Redirect} from 'react-router-dom';


export default class Welcome extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	showLogin: false,
	    	showRegister: false,
	    	redirect: false
	    }

	    if (localStorage.getItem('token_auth') != null) {
	    	var token = localStorage.getItem('token_auth');
	    	this.props.api.defaults.headers.common['Authorization'] = 'Bearer '+token;
	    	this.props.api.get('/verify')
	    	.then(((response) => {
	    		if (response.status == 200) {
	    			this.props.set_user(
		    			response.data.first_name,
						response.data.last_name,
						response.data.id,
						token);
	    			this.setState({redirect: true});
	    		}
	    	}).bind(this))
	    	.catch((error) => {
	    		if (error.response.status == 401) {
	    			this.props.api.defaults.headers.common['Authorization'] = '';	
	    		}
	    	})
	    }
	}

	render() {

		const modalStyle = {
	      position: 'fixed',
	      zIndex: 1040,
	      top: 0, bottom: 0, left: 0, right: 0,
	    };

	    const backdropStyle = {
	      position: 'fixed',
	      zIndex: 1040,
	      top: 0, bottom: 0, left: 0, right: 0,
	      zIndex: 'auto',
	      backgroundColor: '#000',
	      opacity: 0.5
	    };

	    const dialogStyle = {
	      position: 'absolute',
	      width: 400,
	      top: 50 + '%', left: 50 + '%',
	      transform: `translate(-${50}%, -${50}%)`,
	      border: '1px solid #e5e5e5',
	      backgroundColor: 'white',
	      boxShadow: '0 5px 15px rgba(0,0,0,.5)',
	      padding: 20,
	      borderRadius: '10px'
	    };

	    if (this.state.redirect) {
			return (<Redirect to="/home"/>)
		}

		return (
			<div style={{
				background: "{{ url_for('static', filename='images/mail_wallpaper.jpg') }} no-repeat center center fixed", 
				backgroundSize: 'cover',
				height: '100%',
				fontFamily: 'Open Sans',
				color: 'white',
				fontSize: '27pt'
			}}>
				<div style={{
					width: '45%',
					marginRight: 50,
					marginLeft: 'auto',
					paddingTop: 100
				}}>
					<p>Добро пожаловать на портал бронирования переговорок в офисе <b>Mail.Ru</b>!</p>

					<button 
						onClick={() => this.setState({showLogin: true})}
						className={css(styles.button)}
					>
						Войти
					</button>


					<Modal 
						show={this.state.showLogin}
						onHide={() => this.setState({showLogin: false})}
						style={modalStyle}
						backdropStyle={backdropStyle}
					>

						<div style={dialogStyle}>
						  <LoginForm
						    register={() => this.setState({showRegister: true, showLogin: false})}
						    redirect={(() => this.setState({redirect: true})).bind(this)}
						    set_user={this.props.set_user}
						    api={this.props.api}
						  />
						</div>

					</Modal>

					<Modal
						show={this.state.showRegister}
						onHide={() => this.setState({showRegister: false, showLogin: true})}
						style={modalStyle}
						backdropStyle={backdropStyle}
					>
						<div style={dialogStyle}>
						  <RegisterForm
						  	login={() => this.setState({showRegister: false, showLogin: true})}
						  	api={this.props.api}
						  />
						</div>
					</Modal>

				</div>
			</div>
		);
	}
}


var styles = StyleSheet.create({
	button: {
		fontSize: '15pt', marginTop: 30,
		backgroundColor: 'rgba(0,0,0,0) !important',
		color: 'white',
		border: '1px solid white',
		borderRadius: '5px',
		width: 90,
		height: 50
	}
});