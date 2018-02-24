from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
from flask_login import LoginManager
from flask_mail import Mail

template_dir = os.path.abspath('../front')
static_dir = os.path.abspath('../front')

app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
login_manager = LoginManager()
login_manager.init_app(app)

mail = Mail(app)

from app import routes, models
from models import User

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)
