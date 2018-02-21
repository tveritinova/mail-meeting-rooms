from flask import render_template
from app import app

basedir = os.path.abspath(os.path.dirname(__file__))

@app.route('/')
def index():
    return render_template(basedir + '../front/index.html')