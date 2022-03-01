from flask import Flask, send_from_directory
from alphaa_home_api import home
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS 
import os

app = Flask(__name__)
api = Api(app)
CORS(app)

UPLOAD_FOLDER = r'C:\\Users\\User-16\\Desktop\\Alphaa Project\\data'
ALLOWED_EXTENSIONS = set(['csv', 'xlsx', 'xls'])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.register_blueprint(home, url_prefix='')

if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(debug=True)