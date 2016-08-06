from __future__ import absolute_import
from flask import current_app, request

import logging
import json

from . import app

from twilio import twiml
from firebase import Firebase
from firebase_token_generator import create_token

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

def get_next_id(firebase):
    """
        Determine the next id in Firebase.
        Args:
            firebase: Firebase instance connexion
        Return: int next id
    """
    result = firebase.get()
    return 1 if result is None else len(result) + 1

@app.route('/sms-reciever', methods=['GET', 'POST'])
def smsReciever():
    """
        Handle the SMS when is coming and save it in Firebase
    """
    r = twiml.Response()

    # Limit the request to my phone number
    if not request.form.has_key('From') \
    and request.form['Body'] != current_app.config['MY_PHONE_NUMBER']:
        r.message('Not allowed to send a message !')
        return str(r)

    # initiate the connexion to Firebase
    auth_payload = {"uid": "1", "auth_data": "foo", "other_auth_data": "bar"}
    token = create_token(current_app.config['FIREBASE_SECRET'] , auth_payload)

    FIREBASE_PROJECT = current_app.config['FIREBASE_PROJECT']
    firebase = Firebase(FIREBASE_PROJECT, token)

    # Get the message
    if request.form.has_key('Body'):
        body = request.form['Body']

        # Get the next firebase Id and parse the content to firebase
        next_id = get_next_id(firebase)
        content = get_content(body, next_id)

        # saved the content in firebase
        if content is not None:
            try:
                result = firebase.post(content)
                r.message("Record saved ! id = {}".format(next_id))
            except Exception, e:
                r.message("Can't save the record in firebase")
        else:
            r.message("Bad body format")
    else :
        r.message("Can't get the body message")

    return str(r)
