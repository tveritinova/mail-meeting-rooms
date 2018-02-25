# -*- coding: utf-8 -*-

from flask import render_template, request, url_for
from app import app, db, mail
from app.models import User, Room, Event
import os
from flask_cors import CORS, cross_origin
import json
from datetime import datetime
from passlib.hash import pbkdf2_sha256
from token_ import generate_confirmation_token, confirm_token
from flask.ext.mail import Message
from sqlalchemy.orm.exc import NoResultFound
from smtplib import SMTPRecipientsRefused
from functools import wraps
from dateutil.parser import parse


basedir = os.path.abspath(os.path.dirname(__file__))


def requires_auth(f):
	@wraps(f)
	def decorated(*args, **kwargs):
		print request.headers['Authorization'].split(' ')
		token = request.headers['Authorization'].split(' ')[1]
		user = User.verify_auth_token(token)
		
		if user is None:
			return 'not authorized', 401

		return f(user, *args, **kwargs)
	return decorated


@app.route('/verify', methods=['GET'])
@cross_origin()
@requires_auth
def verify_user(user):
	return json.dumps({
		'id': user.id, 
		'first_name': user.first_name, 
		'last_name': user.last_name,
		'is_admin': user.admin
	}), 200


@app.route('/')
def index():
	return render_template('index.html')


@app.route('/rooms', methods=['GET'])
@cross_origin()
@requires_auth
def get_rooms(user):
	return json.dumps([{
		"id": room.id,
		"name": room.name, 
		"floor_num": room.floor_num,
		"events": [
			{
				"title": event.title,
				"description": event.description,
				"begin": str(event.begin),
				"end": str(event.end),
				"user_id": event.user_id
			} for event in room.events
		]
	} for room in Room.query.all()]), 200


@app.route('/rooms', methods=['POST'])
@cross_origin()
@requires_auth
def post_rooms(user):
	if user.admin == True:
		data = json.loads(request.data)

		room = Room(name=data["name"], floor_num=data["floor_num"])
		db.session.add(room)
		db.session.commit()
	else:
		return 'user not admin', 403

	return '', 404


@app.route('/rooms/<int:room_id>', methods=['DELETE'])
@cross_origin()
@requires_auth
def delete_room(room_id, user):
	if user.admin == True:
		Room.query.filter(Room.id == room_id).delete()
		db.session.commit()
	else:
		return 'user not admin', 403

	return '', 404


@app.route('/rooms/<int:room_id>', methods=['PUT'])
@cross_origin()
@requires_auth
def update_room(user):
	if user.admin == True:
		data = json.loads(request.data)

		room = Room.query.filter(Room.id == room_id).one()
		room.name = data['name']
		room.floor_num = data['floor_num']
		db.session.commit()
	else:
		return 'user not admin', 403

	return '', 404


def send_info_mail(to, event):
	msg = Message(
		"Переговорная забронирована",
		recipients=[to],
		html=render_template('booking.html', 
			room_name=Room.query.filter(Room.id == event.room_id).one().name,
			begin=str(event.begin),
			end=str(event.end),
			title=event.title,
			description=event.description
		),
		sender=app.config['MAIL_DEFAULT_SENDER']
	)
	mail.send(msg)


@app.route('/events', methods=['POST'])
@cross_origin()
@requires_auth
def post_event(user):
	data = json.loads(request.data)

	print data

	begin = parse(data['begin'])
	end = parse(data['end'])

	for event in Event.query.filter(Event.room_id == data['room_id']).all():
		if event.begin < begin < event.end or \
		begin < event.begin < end or (event.begin == begin and event.end == end):
			return 'time unavailable', 400

	event = Event(
		title=data['title'],
		description=data['description'],
		begin=begin,
		end=end,
		room_id=data['room_id'],
		user_id=user.id
	)

	db.session.add(event)
	db.session.commit()

	send_info_mail(user.email, event)

	return 'success', 201


@app.route('/login', methods=['POST', 'GET'])
@cross_origin()
def login():
	data = json.loads(request.data)

	try:
		user = User.query.filter(User.email == data['email']).one()
	except NoResultFound:
		return 'no user', 401

	if not pbkdf2_sha256.verify(data['password'], user.password_hash):
		return 'wrong password', 401

	if not user.confirmed:
		return 'not confirmed', 401

	return json.dumps({
		'id': user.id, 
		'first_name': user.first_name, 
		'last_name': user.last_name,
		'is_admin': user.admin,
		'token': user.generate_auth_token()
	}), 200


def send_email(to, confirm_url):
    msg = Message(
        "Подтверждение регистрации",
        recipients=[to],
        html=render_template('confirm.html',url=confirm_url),
        sender=app.config['MAIL_DEFAULT_SENDER']
    )
    mail.send(msg)


@app.route('/users', methods=['POST'])
@cross_origin()
def register():
	data = json.loads(request.data)

	if User.query.filter(User.email == data['email']).scalar() is not None:
		return 'user already exists', 400

	print data['first_name'].encode('utf8')

	user = User(
		email=data['email'], 
		password_hash=pbkdf2_sha256.encrypt(data['password']),
		first_name=data['first_name'].encode('utf8'),
		last_name=data['last_name'].encode('utf8'),
		registered_on=datetime.now())

	try:
		token = generate_confirmation_token(user.email)
		confirm_url = url_for('confirm', token=token, _external=True)
		send_email(user.email, confirm_url)
	except SMTPRecipientsRefused:
		return 'email invalid', 400

	db.session.add(user)
	db.session.commit()

	return 'user created', 201


@app.route('/confirm/<token>')
def confirm(token):
    email = confirm_token(token)
    user = User.query.filter(User.email == email).one()

    if not user.confirmed:
	    user.confirmed = True
	    user.confirmed_on = datetime.now()
	    db.session.commit()

    return 'confirmed', 200


