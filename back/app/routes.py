from flask import render_template, request, url_for
from app import app, db, mail
from app.models import User, Room, Event
import os
from flask_cors import CORS, cross_origin
import json
from datetime import datetime
from flask_login import login_user
from passlib.hash import pbkdf2_sha256
from token_ import generate_confirmation_token, confirm_token
from flask.ext.mail import Message
from sqlalchemy.orm.exc import NoResultFound
from smtplib import SMTPRecipientsRefused


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

	try:
		user = User.query.filter(User.email == data['email']).one()
	except NoResultFound:
		return 'no user', 401

	if not pbkdf2_sha256.verify(data['password'], user.password_hash):
		return 'wrong password', 401

	if not user.confirmed:
		return 'not confirmed', 401

	login_user(user)

	return json.dumps({'id': user.id, 'first_name': user.first_name, 'last_name': user.last_name}), 200

def send_email(to, confirm_url):
    msg = Message(
        "Please confirm your email",
        recipients=[to],
        html="<a href="+confirm_url+">Confirm</a>",
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
		first_name=data['first_name'],
		last_name=data['last_name'],
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


