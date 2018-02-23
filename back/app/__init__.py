from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os

template_dir = os.path.abspath('../front')
static_dir = os.path.abspath('../front')

app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from app import routes#, models
