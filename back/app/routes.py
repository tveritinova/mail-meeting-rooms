from flask import render_template, request
from app import app, db
from app.models import User, Room, Event
import os
from flask_cors import CORS, cross_origin
import json
from datetime import datetime

basedir = os.path.abspath(os.path.dirname(__file__))



@app.route('/')
def index():
    return render_template('index.html')

'''
@app.route('/rooms', methods=['GET'])
def get_rooms():
	return Room.query.all()


@app.route('/rooms', methods=['POST'])
def post_rooms():
	rooms = Room(name= , floor_num= )


@app.route('/login', methods=['POST'])
'''


@app.route('/users', methods=['POST'])
@cross_origin()
def register():
	data = json.loads(request.data)
	print data
	db.session.add(User(
		email=data['email'], 
		password_hash=data['password'],
		registered_on=datetime.now()))
	db.session.commit()

	return '', 200