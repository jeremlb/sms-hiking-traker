#!/bin/bash
# Author Jeremi Le Bourhis <jlebourhis@gpartner.eu>

# This function test if gcloud is installed
get_gcloud_cli_path () {
  # if [ '$(type -P gcloud)' != '' ]; then
  #   echo $(type -P gcloud)
  # elif [ ! -d "google-cloud-sdk" ]; then
  #   echo google-cloud-sdk/lib/gcloud.py
  # else
  #   echo ''
  # fi
  echo google-cloud-sdk/bin/gcloud
  return 10
}
