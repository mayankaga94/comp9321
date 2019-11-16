from flask import Flask, request
from flask_restplus import Resource, Api, fields
from os import environ as env
import datetime
import pytz
import json
from os import environ as env
import datetime
from sqlalchemy import exists, and_
import pytz
import requests
import json

TZ = pytz.timezone('Australia/Sydney')
NOW = datetime.datetime.now(tz=TZ).time()
TODAY = datetime.datetime.now(tz=TZ).date()
PORT = int(env.get("PORT", 3000))
DEBUG_MODE = int(env.get("DEBUG_MODE", 1))

# define the initial context of app
app = Flask(__name__)
api = Api(app,
          default="FIFA Database",  # Default namespace
          title="Service to predict the overall rating of a player based of values",  # Documentation Title
          description="An application which receives the values and predicts the closest player ")  # Document Description

#SAMPLE GET
@api.route('/sample')
class User(Resource):
    @api.response(404, 'Not Found')
    @api.response(201, 'Created')
    @api.response(200, 'OK')
    @api.doc(description="SAMPLE GET")
    def get(self, user_id):
        return




# Sample POST
@api.route('/post_sample')
class Payment(Resource):
    @api.response(404, 'Not Found')
    @api.response(201, 'Created')
    @api.response(200, 'OK')
    @api.response(409, 'Conflict')
    def post(self):
        values = json.loads(request.get_json(force=True))
        print(values)
        return {"Message" : "Value Printed"}, 200


@api.route('/test')
class Test(Resource):
    @api.response(404, 'Not Found')
    @api.response(201, 'Created')
    @api.response(200, 'OK')
    @api.doc(description="Test the api using json")
    def get(self):
        json_dict = '{ "Value_1": 15 , "Value_2": 20 ,"Value_3": 25 ,"Value_4" : 30, "Value_5": 35 } '
        url = "http://localhost:3000/post_sample"

        headers = {'Content-Type': 'application/json'}

        r = requests.post(url, data=json.dumps(json_dict), headers=headers)
        return r.text


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=PORT, debug=DEBUG_MODE)