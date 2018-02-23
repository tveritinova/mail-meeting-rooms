from flask import render_template, request
from app import app
#from app.models import User, Room, Event
import os

basedir = os.path.abspath(os.path.dirname(__file__))


'''
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/rooms', methods=['GET'])
def get_rooms():
	return Room.query.all()


@app.route('/rooms', methods=['POST'])
def post_rooms():
	rooms = Room(name= , floor_num= )


@app.route('/login', methods=['POST'])
'''


@app.route('/users', methods=['POST'])
def register():
	print request.form