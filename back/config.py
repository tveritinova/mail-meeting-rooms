import os
from secure_info import user, password, mail_user, mail_password

basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = 'mysql://'+user+':'+password+'@localhost/app?charset=utf8'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_HEADERS = 'Content-Type'
    DEBUG = True
    SECURITY_PASSWORD_SALT = 'my_precious_two'

     # mail settings
    MAIL_SERVER = 'smtp.googlemail.com'
    MAIL_PORT = 465
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True

    # gmail authentication
    MAIL_USERNAME = mail_user
    MAIL_PASSWORD = mail_password

    # mail accounts
    MAIL_DEFAULT_SENDER = 'from@example.com'