from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    events = db.relationship('Event', backref='user', lazy=True)


class Room(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(64), index=True, unique=True)
	floor_num = db.Column(db.Integer)
	events = db.relationship('Event', backref='room', lazy=True)


class Event(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	title = db.Column(db.String(128))
	description = db.Column(db.String(300))
	begin = db.Column(db.DateTime()) 
	end = db.Column(db.DateTime()) 
	room_id = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=False) 
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)