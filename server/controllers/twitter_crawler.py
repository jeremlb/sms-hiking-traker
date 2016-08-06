from __future__ import absolute_import
from flask import current_app, request, make_response

import logging
import json
import oauth2

from . import app

from firebase import Firebase
from firebase_token_generator import create_token

CONSUMER_SECRET = app.config['CONSUMER_SECRET']
CONSUMER_KEY    = app.config['CONSUMER_KEY']

def get_content(message, next_id):
    """
    Parse the SMS content and format to be save in Firebase
    body example : 48.87695,2.32943 - sunny - break - pozey oklm

    Args:
        message : str sms content
        next_id : int id in Firebase
    """
    try:
        content = message.split(' - ')

        return {
            'id': next_id,
            'latitude': float(content[0].split(',')[0]),
            'longitude': float(content[0].split(',')[1]),
            'weather': content[1],
            'type': content[2],
            'message': content[3],
            'photos': list()
        }

    except Exception, e:
        return None


def oauth_req(url, key, secret, http_method="GET", \
    post_body="", http_headers=None):
    logging.info(CONSUMER_KEY)
    consumer = oauth2.Consumer(key=CONSUMER_KEY, secret=CONSUMER_SECRET)
    token = oauth2.Token(key=key, secret=secret)
    client = oauth2.Client(consumer, token)
    resp, content = client.request( url, method=http_method, body=post_body, headers=http_headers )
    return content

def get_useful_data(tweets):
    data = list()

    for tweet in tweets:
        data.append(tweet)

    return data

@app.route('/twitter-crawler', methods=['GET'])
def twitter_crawler():
    """
        Endpoint called by Google App Engine
        Schecule task who crawl twitter to get my last tweet (media)
    """
    tweets = list() # set the variable

    user_timeline = oauth_req(
        'https://api.twitter.com/1.1/statuses/user_timeline.json',
        app.config['ACCESS_TOKEN'],
        app.config['ACCESS_TOKEN_SECRET']
    )

    try:
        tweets = json.loads(user_timeline)
    except Exception, e:
        logging.info('Impossible de parser la reponse de twitter')
        logging.info(user_timeline)



    logging.info(home_timeline)
    resp = make_response(home_timeline, 200)
    resp.headers['Content-Type'] = 'application/json'
    return resp
