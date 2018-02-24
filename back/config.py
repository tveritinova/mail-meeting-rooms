import os
from secure_info import user, password

basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = 'mysql://'+user+':'+password+'@localhost/app'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_HEADERS = 'Content-Type'
    DEBUG = True
    SECURITY_PASSWORD_SALT = 'my_precious_two'