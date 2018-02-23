from flask import render_template, request
from app import app, db
from app.models import User, Room, Event
import os
from flask_cors import CORS, cross_origin
import json
from datetime import datetime
from flask_login import login_user

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
'''

@app.route('/login', methods=['POST', 'GET'])
@cross_origin()
def login():
	data = json.loads(request.data)

	user = User.query.filter(User.email == data['email']).one()

	print(user.password_hash)
	print(data)

	print user.password_hash.split('$')

	salt, password = user.password_hash.split('$')

	if hashlib.sha1(salt.encode() + data['password'].encode()).hexdigest() != password:
		return 'wrong password', 401

	login_user(user)

	return 'authorized', 200


@app.route('/users', methods=['POST'])
@cross_origin()
def register():
	data = json.loads(request.data)
	print data
	db.session.add(User(
		email=data['email'], 
		password_hash=data['password'],
		first_name=data['first_name'],
		last_name=data['last_name'],
		registered_on=datetime.now()))
	db.session.commit()

	return '', 200