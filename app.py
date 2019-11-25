from flask import Flask, request, jsonify
from flask_restplus import Resource, Api, fields
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from sklearn.utils import shuffle
from functools import wraps
import jwt
import pickle
from os import environ as env
import os
import datetime
import json
from multiprocessing import Value
from flask_restplus import abort, reqparse

PORT = int(env.get("PORT", 3000))
DEBUG_MODE = int(env.get("DEBUG_MODE", 1))
counter = Value('i', 0)
counter_nearest_player = Value('i', 0)
counter_team = Value('i',0)
counter_tags = Value('i',0)
counter_player = Value('i',0)
counter_rating = Value('i',0)



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

def validate_new_data(data):

    if 0  in data:
        return False
    elif None in data:
        return False
    elif 'string' in data:
        return False
    else:
        return True

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
          title="Services to provide insights and predictions on FIFA Dataset",  # Documentation Title
          description="An application which uses the FIFA dataset to run machine learning algorithms to give the "
                      "overall rating of a new player and three other closest players to the new player. The "
                      "application also returns Graphs about the overall  player and details about the players")  #
# Document Description
prediction = api.model('Prediction', {
    'Reactions': fields.Integer(),
    'Composure': fields.Integer,
    'Vision': fields.Integer,
    'ShortPassing': fields.Integer,
    'BallControl': fields.Integer,
})
player = api.model('Player', {
    'ID': fields.Integer,
    'Name': fields.String,
    'Nationality':fields.String,
    'Overall': fields.Float,
    'Wage': fields.Integer,
    'Reactions': fields.Integer,
    'Age' :fields.Integer,
    'Composure': fields.Integer,
    'Vision': fields.Integer,
    'ShortPassing': fields.Integer,
    'BallControl': fields.Integer,
    'Photo': fields.Url,
    'Flag': fields.Url
})


def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        token = request.headers.get('AUTH-TOKEN')
        print(token)
        if not token:
            abort(401, 'Authentication token is missing')
        try:
            auth.validate_token(token)
        except Exception as e:
            abort(401, e)

        return f(*args, **kwargs)

    return decorated


credential_model = api.model('credential', {
    'Username': fields.String,
    'Password': fields.String
})



def name_reduced(s):
    # split the string into a list
    l = s.split()

    l = [i.capitalize() for i in l]
    for v, i in enumerate(l):
        if "-" in i:
            temp = i.split("-")

            temp = [j.capitalize() for j in temp]
            temp_name = "-".join(j for j in temp)
            l[v] = i.replace(i, temp_name)

    name = " ".join(i for i in l)

    return name


@api.route('/token')
class Token(Resource):
    @api.response(200, 'Successful')
    @api.response(500, 'Internal Server Error')
    @api.doc(description="Generates a authentication token")
    # @api.expect(credential_parser, validate=True)
    @api.expect(credential_model)
    def post(self):
        # args = credential_parser.parse_args()
        #
        # username = args.get('username')
        # password = args.get('password')
        values = request.get_json(force=True)
        username = values['Username']
        password = values['Password']
        if username == 'admin' and password == 'admin':
            #             print("Entered here")
            token_to_be_sent = auth.generate_token(username)
            #             print(token_to_be_sent)
            return {'token': str(token_to_be_sent,'utf-8')},200
        else :
            return {"message": "authorization has been refused for those credentials."}, 401



@api.route('/player')
class Player(Resource):
    @api.response(404, 'Not Found')
    @api.response(201, 'Created')
    @api.doc(description="Returns 1000 players")
    @api.response(200, 'OK')
    @api.response(409, 'Conflict')
    @api.response(500, 'Internal Server Error')
    def get(self):
        self.index()
        df = pd.read_csv('data_reduced.csv', index_col=0)

        return df.head(1000).to_dict('index'), 200

    @requires_auth
    @api.response(401, 'Unauthorized')
    @api.expect(player)
    @api.doc(description="Add a new player")
    def post(self):
        self.index()
        df = pd.read_csv('data_reduced.csv', index_col=0)
        values = request.get_json(force=True)
        try :
            new_player = [values['ID'], values['Name'], values['Nationality'], values['Overall'], values['Wage'],
                          values['Reactions'], values['Composure'], values['Vision'], values['ShortPassing'],
                          values['BallControl'], values['Photo'], values['Flag']]
        except:
            return {'Message' : 'Missing Values. Enter all Values'} ,422
        val = validate_new_data(new_player)
        if val  :
            df = df.append(pd.Series(new_player,
                                     index=['ID', 'Name', 'Nationality', 'Overall', 'Wage', 'Reactions', 'Composure',
                                            'Vision', 'ShortPassing', 'BallControl', 'Photo', 'Flag']), ignore_index=True)
            df.to_csv('data_reduced.csv')
            return {'Message': 'Posted'}, 200
        else:
            return {'Message': 'Value Error'}, 422

    @staticmethod
    def index():
        with counter.get_lock():
            counter_player.value += 1
        return jsonify(count=counter_player.value)

@api.route('/rating/<name>')
class Rating(Resource):
    @api.response(404, 'Not Found')
    @api.response(201, 'Created')
    @api.doc(description="Returns plot of overall rating of a given player")
    @api.response(200, 'OK')
    @api.response(409, 'Conflict')
    @api.response(500, 'Internal Server Error')
    def get(self, name):
        self.index()
        name = name_reduced(name)
        # name = name.capitalize()
        df = pd.read_csv('data.csv', index_col=0)
        player = df.query(f"Name == '{name}'")
        if len(player)>0 :
            x = df['Overall']
            plt.clf()
            player_rating = int(player['Overall'].to_string(index=False))
            sns_plot = sns.kdeplot(x, shade=True)
            plt.axvline(player_rating, 0, 1, color='red')
            fig = sns_plot.get_figure()
            fig.savefig("comp9321\output.png")
            return  {'Message': 'output.png'}, 200
        else:
            return {"message": "Player not found"}, 401

    @staticmethod
    def index():
        with counter.get_lock():
            counter_rating.value += 1
        return jsonify(count=counter_rating.value)

@api.route('/tags/<name>')
class Tags(Resource):
    @api.response(404, 'Not Found')
    @api.response(201, 'Created')
    @api.doc(description="Returns tags of a given player")
    @api.response(200, 'OK')
    @api.response(409, 'Conflict')
    @api.response(500, 'Internal Server Error')
    def get(self, name):
        self.index()
        name = name_reduced(name)
        # name = name.capitalize()
        df = pd.read_csv('data.csv', index_col=0)
        df = df[['Name', 'Age', 'Nationality', 'Overall', 'Wage', 'Reactions', \
                 'Composure', 'Vision', 'ShortPassing', 'BallControl']]

        second_df = pd.read_csv('fifa_cleaned.csv', index_col=0)
        second_df = second_df[['name', 'tags']]

        new_names = ['Name', 'Tags']
        second_df.columns = new_names

        merged_df = pd.merge(df, second_df, on='Name')
        req = merged_df.query(f"Name == '{name}'")
        if len(req)!= 0:
            player_tags = req['Tags']
            tags_list = player_tags[0].split('#')
            tags_list = [e.strip(',') for e in tags_list if len(e) > 1]
            players = {'Tags': tags_list}
            return players, 200
        else :
            return {"message": "Player not found"}, 401

    @staticmethod
    def index():
        with counter.get_lock():
            counter_tags.value += 1
        return jsonify(count=counter_tags.value)

@api.route('/team/<country>')
class Teams(Resource):
    @api.response(404, 'Not Found')
    @api.response(201, 'Created')
    @api.doc(description="Returns team of a given country name")
    @api.response(200, 'OK')
    @api.response(409, 'Conflict')
    @api.response(500, 'Internal Server Error')
    def get(self, country):
        self.index()
        Country = country.capitalize()
        df = pd.read_csv('fifa_players.csv', encoding='ISO-8859-1')
        players = df.query(f"nationality == '{Country}'")
        if len(players) == 0:
            return {"message": "Team not found"}, 401
        else:
            players_list = [player for player in players['player']]
            team = {'Team':players_list}
            return team, 200

    @staticmethod
    def index():
        with counter.get_lock():
            counter_team.value += 1
        return jsonify(count=counter_team.value)


@api.route('/player/<name>')
class Players(Resource):
    @api.response(404, 'Not Found')
    @api.response(201, 'Created')
    @api.response(401, 'Unauthorized')
    @api.doc(description="Returns 1000 players")
    @api.response(200, 'OK')
    @api.response(409, 'Conflict')
    @api.response(500, 'Internal Server Error')
    def get(self, name):
        self.index()
        name = name_reduced(name)
        df = pd.read_csv('data_reduced.csv', index_col=0)

        df = df[df['Name'] == name]
        print(df)
        if df.empty:
            return {"message": "Player not found"}, 401
        else:
            return df.to_dict('records'), 200

    @requires_auth
    @api.response(401, 'Unauthorized')
    @api.expect(player)
    @api.doc(description="Update a player on the player name")
    def put(self, name):
        self.index()
        df = pd.read_csv('data_reduced.csv', index_col=0)

        values = request.get_json(force=True)
        name = name_reduced(name)
        # name = name.capitalize()
        df2 = df[df['Name'] == name]
        if df2.empty:
            return {"message": "Player not found"}, 401
        else:
            for i in values.keys():
                if i in [None,'string',0]:
                    return {'Message' : 'Value Error'}, 422
                else :
                    df.loc[df.Name == name, i] = values[i]
            df.to_csv('data_reduced.csv')
            return {'Message': 'Updated'}, 200

    @staticmethod
    def index():
        with counter.get_lock():
            counter_player.value += 1
        return jsonify(count=counter_player.value)

    @requires_auth
    @api.doc(description="Delete a player on the player name")
    def delete(self, name):
        df = pd.read_csv('data_reduced.csv', index_col=0)
        name = name_reduced(name)
        # print(name)
        df2 = df[df['Name'] == name]
        print(df2)
        if df2.empty:
            return {"message": "Player not found"}, 401
        else:
            df = df[df.Name != name]
            df.to_csv('data_reduced.csv')
            return {'Message': 'Deleted'}, 200


@api.expect(prediction)
@api.route('/overall')
class Overall(Resource):
    # @requires_auth
    @api.response(404, 'Not Found')
    @api.response(201, 'Created')
    @api.response(200, 'OK')
    @api.response(409, 'Conflict')
    @api.response(500, 'Internal Server Error')
    @api.doc(description="Predicts overall rating based on a given variables")
    def post(self):
        self.index()
        filename = 'Regressor_model.sav'
        new_player = []
        values = request.get_json(force=True)
        new_player = [values['Reactions'], values['Composure'], values['Vision'], values['ShortPassing'],
                      values['BallControl']]
        val = validate_new_data(new_player)
        if len(new_player) != 5:
            return {'Message': 'Value Error'}, 422
        if val :
            reg = pickle.load(open(filename, 'rb'))
            overall_rating = self.calc_overall(new_player, reg)
            print(overall_rating)
            return {"Overall_Rating": overall_rating[0]}, 200
        else :
            return {'Message': 'Value Error'}, 422


    @staticmethod
    def calc_overall(new_player, model):
        return model.predict([new_player])

    @staticmethod
    def index():
        with counter.get_lock():
            counter.value += 1
        return jsonify(count=counter.value)


@api.expect(prediction)
@api.route('/closest')
class Closest(Resource):
    # @requires_auth
    @api.response(404, 'Not Found')
    @api.response(201, 'Created')
    @api.response(200, 'OK')
    @api.response(409, 'Conflict')
    @api.response(500, 'Internal Server Error')
    @api.doc(description="Returns top three closest players")
    def post(self):
        self.index()

        new_player = []
        values = request.get_json(force=True)
        new_player = [values['Reactions'], values['Composure'], values['Vision'], values['ShortPassing'],
                      values['BallControl']]
        val = validate_new_data(new_player)
        print(val)
        if len(new_player) != 5:
            return {'Message': 'Value Error'}, 422
        if val :
            closest_players = self.closest(new_player)

            return {"Closest_Player": closest_players}, 200
        else:
            return {'Message' : 'Value Error'}, 422

    @staticmethod
    def closest(new_player):
        df = pd.read_csv('data_reduced.csv', index_col=0)
        df = shuffle(df, random_state=10)

        df = df[['Reactions', 'Composure', 'Vision', 'ShortPassing', 'BallControl', 'Name']]
        df = df.dropna()

        X = df.drop('Name', axis=1)
        y = df['Name']
        neigh = NearestNeighbors(n_neighbors=3)
        neigh.fit(X)
        preds = neigh.kneighbors([new_player], 3, return_distance=False)

        closest_players = [y.iloc[pred] for pred in preds[0]]
        df = pd.read_csv('data_reduced.csv', index_col=0)
        photos = []
        for i in closest_players:
            df1 = df[df['Name'] == i]

            if df1.shape[0] == 1:
                photos.append(df1['Photo'].to_string(index=False))
            else:

                photos.append(df1['Photo'].iloc[0])
        dic = {'player1': [closest_players[0], photos[0]], 'player2': [closest_players[1], photos[1]],
               'player3': [closest_players[2], photos[2]]}
        return dic,200
        # for i in closest_players:
        #     df1 = df[df['Name'] == i]
        #     photos.append(df1['Photo'].to_string(index=False))
        # dic = {'player1' : [closest_players[0],photos[0]] , 'player2' : [closest_players[1],photos[1]] , 'player3': [closest_players[2],photos[2]]}
        # return dic

    @staticmethod
    def index():
        with counter_nearest_player.get_lock():
            counter_nearest_player.value += 1
        return jsonify(count=counter_nearest_player.value)


@api.route('/counter')
class Test(Resource):
    @requires_auth
    @api.response(401, 'Unauthorized')
    @api.response(404, 'Not Found')
    @api.response(201, 'Created')
    @api.response(200, 'OK')
    @api.response(500, 'Internal Server Error')
    @api.doc(description="Keep track of the number of times each Api is called")
    def get(self):
        return jsonify(count_overall=counter.value, count_closest=counter_nearest_player.value,team = counter_team.value,rating = counter_rating.value, tags = counter_tags.value,player = counter_player.value , total =counter.value + counter_nearest_player.value + counter_team.value + counter_rating.value + counter_player.value + counter_tags.value) , 200


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=PORT, debug=DEBUG_MODE)
