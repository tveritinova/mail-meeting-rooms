import React from "react";
import { StyleSheet, css } from 'aphrodite';
import Room from "./Room";


export default class FloorsTable extends React.Component {

	get_rooms_for_floor(floor_num) {
		return this.props.rooms.filter((room) => room.floor_num === floor_num);
	}

	render() {

		return(
			<div className={css(styles.floorsContainer)}>
	    		{ this.props.floors.map((floor_num, i) =>

	    			<div className={css(styles.floorWithNumberContainer)}  key={i}>

	    				<div className={css(styles.floorLabel)}>
	    					<b>{floor_num}</b>
	    				</div>

		    			<div className={css(styles.floorContainer)}>
		    				
		    				{this.get_rooms_for_floor(floor_num).map((room, j) => 

		    					<div className={this.props.selected_room === room.id ? 
		    										css(styles.room, styles.selected_room) : 
	    											css(styles.room)}
				    				onClick={()=>this.props.handleRoomClick(room.id)} key={j}>

					    			<Room name={room.name} 
					    				current={this.props.current} 
					    				events={room.events}/>

					    		</div>
		    				)}

		    			</div>

            			<div className={css(styles.empty)}> </div>

	    			</div>
	    		)}
    		</div>
    	);
	}
}

const styles = StyleSheet.create({
	floorsContainer: {
	  	display: 'flex',
	  	flexDirection: 'column',
	    alignItems: 'center',
	    backgroundColor: '#06397d',
	    padding: '20 0 20 0',
	    width: '80%',
	    borderRadius: '15px',
	    margin: 'auto', 
	    marginTop: 15,
	    marginBottom: 15
	},
	floorWithNumberContainer: {
	    width: '100%', 
	    display: 'flex', 
	    flexDirection: 'row',
	    justifyContent: 'space-around'
	},
	floorLabel: {
		padding: '25 12 5 12',
		width: 45,
		textAlign: 'center',
		color: 'white',
		fontSize: '10pt'
	},
	floorContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		flexWrap: 'wrap',
		borderBottom: '1px solid #DDDDDD',
		width: 380,
		padding: 5,
	},

	room: {
		width: 110,
		margin: 5,
		borderRadius: '7px',
		backgroundColor: '#ebf5f4',
		//border: '2px solid rgba(0,0,0,0)'
	},
	selected_room: {
		//border: '2px solid #911f1e'
		//backgroundColor: '#facb66',
		//color: '#911f1e',
		//textDecoration: 'underline'
		//background: 'linear-gradient(#98e2e1, #17a5a3) !important'

		background: 'linear-gradient(#e4e9f4, #82add6) !important'
	}, 
	empty: {
		width: 45
	},
});
