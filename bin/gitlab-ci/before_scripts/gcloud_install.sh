#!/bin/bash
# Author Jeremi Le Bourhis <jlebourhis@gpartner.eu>

# disable prompts gcloud actions
# for automatic install
export CLOUDSDK_CORE_DISABLE_PROMPTS=1
source bin/utils.sh

GCLOUD_CMD=$(get_gcloud_cli_path)

if [ "$GCLOUD_CMD" == '' ]; then
  echo "gcloud not installed"
  echo "Install gcloud cli tool"
  wget https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-112.0.0-linux-x86.tar.gz
  tar -zxf google-cloud-sdk-112.0.0-linux-x86.tar.gz
  ./google-cloud-sdk/install.sh
  rm -r google-cloud-sdk-112.0.0-linux-x86.tar.gz
  echo "Install Google App Engine Python SDK"
  GCLOUD_CMD=./google-cloud-sdk/lib/gcloud.py
  $GCLOUD_CMD components install app-engine-python
  echo "gcloud installed"
fi

echo "Update gcloud components"
$GCLOUD_CMD components update
echo "gcloud is up to date"
