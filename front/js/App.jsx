
import React from "react";
import {HashRouter, Route, Switch} from 'react-router-dom';
import Home from './Home';
import Welcome from './Welcome';
import {Redirect} from 'react-router-dom';
import axios from 'axios';



export default class App extends React.Component {

	constructor(props) {
		super(props);

    	console.log(localStorage.getItem('token_auth'));

	    this.state = {
	    	user_first_name: '',
	    	user_last_name: '',
	    	user_id: '',
	    	logged: false,
	    	api: axios.create({
				baseURL: 'http://34.216.197.100',
				timeout: 10000,
				transformRequest: [(data) => data],
				headers: {
					'Accept': 'application/json,*/*',
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
					'Access-Control-Allow-Headers': 'Authorization',
				}
	    	}),
	    	auth_header: {}
	    };
	}

	render() {
		return (
			<HashRouter>
				<Switch>
					<Route exact path="/" render={() => <Welcome set_user={(
						(first_name, last_name, id, token) => {
							this.state.api.defaults.headers.common['Authorization'] = 'Bearer '+token;
							this.setState({
								user_first_name: first_name,
								user_last_name: last_name,
								user_id: id,
								logged: true,
							})
						}).bind(this)}
						api={this.state.api}
					/>}
					/>

					
						<Route path="/home" 
							render={() => 
							this.state.logged ?
								<Home 
									user_last_name={this.state.user_last_name}
									user_first_name={this.state.user_first_name}
									user_id={this.state.user_id}
									api={this.state.api}
								/>
							:
								<Redirect to="/" />
						}/> 
				</Switch>
			</HashRouter>
		);
	}
}

