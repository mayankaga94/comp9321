from flask import Flask, request, jsonify
from flask_restplus import Resource, Api, fields
from requests.auth import HTTPBasicAuth
from os import environ as env
import datetime
import pytz
import json
from functools import wraps
import jwt
import pickle
from os import environ as env
import datetime
from sqlalchemy import exists, and_
import pytz
import requests
import json
from multiprocessing import Value
from flask_restplus import abort, reqparse

TZ = pytz.timezone('Australia/Sydney')
NOW = datetime.datetime.now(tz=TZ).time()
TODAY = datetime.datetime.now(tz=TZ).date()
PORT = int(env.get("PORT", 3000))
DEBUG_MODE = int(env.get("DEBUG_MODE", 1))
counter = Value('i', 0)


class AuthenticationToken:
    def __init__(self, secret_key, expires_in):
        self.secret_key = secret_key
        self.expires_in = expires_in

    def generate_token(self, username):
        info = {
            'username': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=self.expires_in)
        }
        return jwt.encode(info, self.secret_key, algorithm='HS256')

    def validate_token(self, token):
        info = jwt.decode(token, self.secret_key, algorithms=['HS256'])
        return info['username']


SECRET_KEY = "A SECRET KEY; USUALLY A VERY LONG RANDOM STRING"
expires_in = 600
auth = AuthenticationToken(SECRET_KEY, expires_in)

# define the initial context of app
app = Flask(__name__)
api = Api(app, authorizations={
    'API-KEY': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'AUTH-TOKEN',
    }
},
          security='API-KEY',
          default="FIFA Database",  # Default namespace
          title="Service to predict the overall rating of a player based of values",  # Documentation Title
          description="An application which receives the values and predicts the closest player ")  # Document Description


def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        token = request.headers.get('AUTH-TOKEN')
        print(token)
        if not token:
            abort(401, 'Authentication token is missing')
        try:
            user = auth.validate_token(token)
        except Exception as e:
            abort(401, e)

        return f(*args, **kwargs)

    return decorated


credential_model = api.model('credential', {
    'username': fields.String,
    'password': fields.String
})

credential_parser = reqparse.RequestParser()
credential_parser.add_argument('username', type=str)
credential_parser.add_argument('password', type=str)


@api.route('/token')
class Token(Resource):
    @api.response(200, 'Successful')
    @api.doc(description="Generates a authentication token")
    @api.expect(credential_parser, validate=True)
    def get(self):
        args = credential_parser.parse_args()

        username = args.get('username')
        password = args.get('password')

        if username == 'admin' and password == 'admin':
            #             print("Entered here")
            token_to_be_sent = auth.generate_token(username)
            #             print(token_to_be_sent)
            return {"token": str(token_to_be_sent, 'utf-8')}

        return {"message": "authorization has been refused for those credentials."}, 401


@api.route('/sample')
class User(Resource):
    @requires_auth
    @api.response(404, 'Not Found')
    @api.response(201, 'Created')
    @api.response(200, 'OK')
    @api.doc(description="SAMPLE GET")
    def get(self):
        print("Hello")
        return


# Sample POST
@api.route('/overall')
class Payment(Resource):
    # @requires_auth
    @api.response(404, 'Not Found')
    @api.response(201, 'Created')
    @api.response(200, 'OK')
    @api.response(409, 'Conflict')
    def post(self):
        self.index()
        filename = 'Regressor_model.sav'
        new_player = []
        values = json.loads(request.get_json(force=True))
        for i in range(5):
            new_player.append(values['Value_' + str(i)])
        reg = pickle.load(open(filename, 'rb'))
        overall_rating = self.calc_overall(new_player, reg)
        print(overall_rating)
        return {"Overall_Rating": overall_rating[0]}, 200

    @staticmethod
    def calc_overall(new_player, model):
        return model.predict([new_player])

    @staticmethod
    def index():
        with counter.get_lock():
            counter.value += 1
        return jsonify(count=counter.value)


@api.route('/test')
class Test(Resource):
    @api.response(404, 'Not Found')
    @api.response(201, 'Created')
    @api.response(200, 'OK')
    @api.doc(description="Test the api using json")
    def get(self):
        json_dict = '{ "Value_0": 66 , "Value_1": 68 ,"Value_2": 64 ,"Value_3" : 67, "Value_4": 70 } '
        url = "http://localhost:3000/overall"
        token = request.headers.get('AUTH-TOKEN')

        headers = {'Content-Type': 'application/json', 'AUTH-TOKEN': token}

        r = requests.post(url, data=json.dumps(json_dict), headers=headers)
        return r.text


# @api.route('/test_admin')
# class Test(Resource):
#     @api.response(404, 'Not Found')
#     @api.response(201, 'Created')
#     @api.response(200, 'OK')
#     @api.doc(description="Test the api using json")
#     def get(self):
#         json_dict = '{ "Value_1": 15 , "Value_2": 20 ,"Value_3": 25 ,"Value_4" : 30, "Value_5": 35 } '
#         url = "http://localhost:3000/post_sample"
#         username = 'admin'
#         password = 'admin'
#         headers = {'Content-Type': 'application/json'}
#
#         r = requests.post(url, data=json.dumps(json_dict), headers=headers, auth=HTTPBasicAuth(username, password))
#         return r.text


@api.route('/test_counter')
class Test(Resource):
    @api.response(404, 'Not Found')
    @api.response(201, 'Created')
    @api.response(200, 'OK')
    @api.doc(description="Test the api using json")
    def get(self):
        return jsonify(count=counter.value)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=PORT, debug=DEBUG_MODE)
