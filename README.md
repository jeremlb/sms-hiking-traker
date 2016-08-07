# sms-hiking-traker

This application is based on :
  - Google App Engine (python Framework and Flask)
  - Firebase (Real-time database)
  - Twilio (SMS server)
  - Angular JS and lumX

To run this project with your own data, you must :
  - Create a Google Cloud Platform project
  - Create a Twilio Account and buy a Phone Number with text message
  - Create a Firebase project (it can be the same as GCP project)

In Twilio configuration you have to configure a Webhook who call the Google App Engine application on /sms-reciever

Requirements:
  - gcloud cli tool
  - gcloud google app engine python
  - virtualenv
  - npm
  - bower
  - python2.7


## Installation

```bash
# For development
$ ./bin/dev-install.sh

# For refreshing webpack bundle
$ npm run build:dev

# Start the server
$ dev_appserver.py app.yaml # start the server on port 8080
# Go to http://localhost:8080

```

Set in Firebase your database rules to be read by anyone :

```json
{
  "rules": {
    ".read": "true",
    ".write": "auth != null"
  }
}
```

## Prepare for production

```bash
# To package the app for production
$ ./bin/prod-install.sh

# To upload your app
$ gcloud auth login your_mail@gmail.com
$ gcloud config set project gcp_project_id
$ gcloud app deploy app.yaml --version=1

# When app uploaded
$ gcloud app browse
```

## Config

Add folder config in server. I removed the folder from the repos to protect my secrets data :)

- server/config
  - __init__.py
  - dev.py
  - prod.py

```python
# dev.py

from __future__ import absolute_import
from .prod import *

# Add below your dev variable config
```

```python
# prod.py

# Firebase
FIREBASE_PROJECT = 'https://YOUR_FIREBASE_ID.firebaseio.com/'
FIREBASE_SECRET = 'YOUR_FIREBASE_SECRET'
AUTH_PAYLOAD  = 'YOUR_AUTH_PAYLOAD'
# For example {"uid": "1", "auth_data": "foo", "other_auth_data": "bar"}
ROOT_OBJECT = 'YOUR_ROOT_OBJECT'

# Twilio
ACCOUNT_SID = "YOUR_TWILIO_SID"
AUTH_TOKEN = "YOUR_TWILIO_TOKEN"
MY_PHONE_NUMBER = 'YOUR_PHONE_NUMBER' # Example : +33611223344


# Twitter
CONSUMER_KEY        = 'YOUR_CONSUMER_KEY'
CONSUMER_SECRET     = 'YOUR_CONSUMER_SECRET'
ACCESS_TOKEN        = 'YOUR_ACCESS_TOKEN'
ACCESS_TOKEN_SECRET = 'YOUR_ACCESS_TOKEN_SECRET'

MATCH_HASHTAG = 'YOUR_HASHTAG'
```

You also have to change configuration in client/js/app.js :
  Google API key : generate your own

Change configuration in client/js/controllers/appController.js :
    Firebase key : generate your own

Create a twitter application and generate project tokens and access_token with your account.

## Cron

A cron is called every two hour to crawl my twitter timeline and match sms message
to tweet (photo and video).

To match I made a format based on sms record id (send by the server) and a hashtag.

The cron is defined in cron.yaml

## Licence

This project is released under the [GPL version 3][1] license.

  [1]: https://www.gnu.org/licenses/gpl.txt
