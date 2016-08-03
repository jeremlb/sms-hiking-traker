#!/bin/bash
# Author Jeremi Le Bourhis <jlebourhis@gpartner.eu>

# disable prompts gcloud actions
# for automatic install
export CLOUDSDK_CORE_DISABLE_PROMPTS=1
export APP_ENGINE_VERSION=1

source bin/utils.sh
GCLOUD_CMD=$(get_gcloud_cli_path)
echo $KEY_FILE > credentials.json

$GCLOUD_CMD auth activate-service-account $GCLOUD_ACCOUNT --key-file credentials.json
$GCLOUD_CMD config set project $PROJECT_ID
$GCLOUD_CMD config set account $GCLOUD_ACCOUNT

$GCLOUD_CMD preview app deploy --version=$APP_ENGINE_VERSION

$GCLOUD_CMD config unset account
$GCLOUD_CMD config unset project

rm credentials.json
