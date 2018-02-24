from app import db

class User(db.Model):
	__tablename__ = "users"
	id = db.Column(db.Integer, primary_key=True)
	email = db.Column(db.String(120), index=True, unique=True)
	password_hash = db.Column(db.String(128))
	first_name = db.Column(db.String(120, convert_unicode=True), nullable=False)
	last_name = db.Column(db.String(120, convert_unicode=True), nullable=False)
	registered_on = db.Column(db.DateTime, nullable=False)
	admin = db.Column(db.Boolean, nullable=False, default=False)
	confirmed = db.Column(db.Boolean, nullable=False, default=False)
	confirmed_on = db.Column(db.DateTime, nullable=True)

	def is_active(self):
		return True

	def get_id(self):
		return self.id

	def is_authenticated(self):
		return self.authenticated

	def is_anonymous(self):
		return False


class Room(db.Model):

	__tablename__ = "rooms"

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(64), index=True, unique=True)
	floor_num = db.Column(db.Integer)
	events = db.relationship('Event', backref='room', lazy=True)


class Event(db.Model):

	__tablename__ = "events"

	id = db.Column(db.Integer, primary_key=True)
	title = db.Column(db.String(128))
	description = db.Column(db.String(300))
	begin = db.Column(db.DateTime()) 
	end = db.Column(db.DateTime()) 
	room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False) 
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)