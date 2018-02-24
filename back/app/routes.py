from flask import render_template, request
from app import app, db
from app.models import User, Room, Event
import os
from flask_cors import CORS, cross_origin
import json
from datetime import datetime
from flask_login import login_user
from passlib.hash import pbkdf2_sha256
# from token_ import generate_confirmation_token, confirm_token


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

	if not pbkdf2_sha256.verify(data['password'], user.password_hash):
		return 'wrong password', 401

	login_user(user)

	return json.dumps({'id': user.id, 'first_name': user.first_name, 'last_name': user.last_name}), 200


@app.route('/users', methods=['POST'])
@cross_origin()
def register():
	data = json.loads(request.data)
	print data
	db.session.add(User(
		email=data['email'], 
		password_hash=pbkdf2_sha256.encrypt(data['password']),
		first_name=data['first_name'],
		last_name=data['last_name'],
		registered_on=datetime.now()))
	db.session.commit()

	#token = generate_confirmation_token(user.email)

	return '', 200

'''
@app.route('/confirm/<token>')
def confirm(token):
    email = confirm_token(token)
    user = User.query.filter(User.email == email).one()
    user.confirmed = True
    user.confirmed_on = datetime.now()
    db.session.commit()
    return redirect(url_for('home'))
'''

