from __future__ import absolute_import
from flask import current_app, request, make_response

import logging
import json
import oauth2

from . import app

from firebase import Firebase
from firebase_token_generator import create_token

# for twitter
CONSUMER_SECRET  = app.config['CONSUMER_SECRET']
CONSUMER_KEY     = app.config['CONSUMER_KEY']
MATCH_HASHTAG    = app.config['MATCH_HASHTAG']

# for firebase
ROOT_OBJECT      = app.config['ROOT_OBJECT']
FIREBASE_PROJECT = app.config['FIREBASE_PROJECT']
FIREBASE_SECRET  = app.config['FIREBASE_SECRET']
AUTH_PAYLOAD = app.config['AUTH_PAYLOAD']

def get_point_firebase():
    points = {}

    # initiate the connexion to Firebase
    token = create_token(FIREBASE_SECRET , AUTH_PAYLOAD)
    firebase_project = FIREBASE_PROJECT + '/' + ROOT_OBJECT + '.json'
    firebase = Firebase(firebase_project, token)
    results = firebase.get()

    if results is not None:
        for result in results:
            points[results[result]['id']] = {
                'key': result,
                'data': results[result]
            }

    return points

def put_point_firebase(key, point):
    # initiate the connexion to Firebase
    token = create_token(FIREBASE_SECRET , AUTH_PAYLOAD)
    firebase_project = FIREBASE_PROJECT + '/' + ROOT_OBJECT + '/' + key +'/.json'
    firebase = Firebase(firebase_project, token)
    firebase.put(point)

def oauth_req(url, key, secret, http_method="GET", \
    post_body="", http_headers=None):
    consumer = oauth2.Consumer(key=CONSUMER_KEY, secret=CONSUMER_SECRET)
    token = oauth2.Token(key=key, secret=secret)
    client = oauth2.Client(consumer, token)
    resp, content = client.request( url, method=http_method, body=post_body, headers=http_headers )
    return content

def has_hashtags(tweet):
    if tweet.has_key('entities') and tweet['entities'].has_key('hashtags'):
        for hashtag in tweet['entities']['hashtags']:
            if hashtag.has_key('text') and hashtag['text'] == MATCH_HASHTAG:
                return True

    return False # return False if hashtag not found

def get_filtered_tweets(tweets):
    data = list()

    for tweet in tweets:
        if tweet.has_key('extended_entities') and has_hashtags(tweet) is True:
            data.append({
                "created_at": tweet['created_at'],
                "id": tweet['id'],
                "text": tweet['text'],
                "extended_entities": tweet['extended_entities'],
            })

    return data

def get_id(tweet):
    sms_id = None

    try:
        data = tweet['text'].split(' - ')
        sms_id = int(data[0])
    except Exception, e:
        logging.info('Can\'t get the id in the tweet text : ' + str(tweet['id']))

    return sms_id

def extract_medias_id_from_point(point):
    photos = []
    videos = []

    if(point.has_key('photos')):
        photos = [photo['id'] for photo in point['photos']]

    if(point.has_key('videos')):
        videos = [video['id'] for video in point['videos']]

    return {
        'photos': photos,
        'videos': videos
    }

def get_video_format(videos):
    formats = []
    mp4 = None
    bitrate = None

    for video in videos:
        if video.has_key('content_type') and video.has_key('url'):
            if video['content_type'] == 'video/mp4':
                if video.has_key('bitrate') and \
                (bitrate > video['bitrate'] or bitrate is None):
                    bitrate = video['bitrate']
                    mp4 = video
            else:
                formats.append(video)

    if mp4 is not None:
        formats.append(mp4)

    return formats

def set_media_to_point(tweet, point):
    updated = False
    points_medias = extract_medias_id_from_point(point)

    if point.has_key('photos') is False:
        point['photos'] = []

    if point.has_key('videos') is False:
        point['videos'] = []

    if tweet['extended_entities'].has_key('media'):
        for media in tweet['extended_entities']['media']:
            if media['type'] == 'photo' and \
            media['id'] not in points_medias['photos']:
                point['photos'].append({
                    'id': media['id'],
                    'url': media['media_url'],
                    'https': media['media_url_https']
                })

                updated = True

            elif media['type'] == 'video' and \
            media['id'] not in points_medias['videos'] and \
            media.has_key('video_info') and media['video_info'].has_key('variants'):
                point['videos'].append({
                    'id': media['id'],
                    'format': get_video_format(media['video_info']['variants'])
                })

                updated = True

    return point, updated

@app.route('/twitter-crawler', methods=['GET'])
def twitter_crawler():
    """
        Endpoint called by Google App Engine
        Schecule task who crawl twitter to get my last tweet (media)
    """
    tweets = list() # set the variable

    # get twitter user timeline
    user_timeline = oauth_req(
        'https://api.twitter.com/1.1/statuses/user_timeline.json',
        app.config['ACCESS_TOKEN'],
        app.config['ACCESS_TOKEN_SECRET']
    )

    # parse twitter data to retrieve usefull data
    try:
        tweets = get_filtered_tweets(json.loads(user_timeline))
    except Exception, e:
        logging.info('Impossible de parser la reponse de twitter')
        logging.info(user_timeline)
        return make_response('Error', 200)

    # fetch firebase database
    try:
        points = get_point_firebase()
    except Exception, e:
        logging.info('Can\'t get the points')
        return make_response('Error', 200)

    for tweet in tweets:
        sms_id = get_id(tweet)

        try:
            if sms_id is not None and points.has_key(sms_id):
                point, updated = set_media_to_point(tweet, points[sms_id]['data'])

                # logging.info(point)
                logging.info(updated)
                if updated is True:
                    put_point_firebase(points[sms_id]['key'], point)
        except Exception, e:
            logging.info('Can\'t set the tweet madia {} to point {}, error {}'.format(
                tweet['id'],
                points[sms_id]['key'],
                str(e)
            ))


    # resp = make_response(user_timeline, 200)
    resp = make_response(json.dumps(tweets), 200)
    resp.headers['Content-Type'] = 'application/json'
    return resp
