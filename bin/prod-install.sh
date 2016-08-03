#!/usr/bin/env bash

set -e

echo "==== Configuring dependencies for production ===="
echo "======= Server installation (PIP) ======"

rm -rf .venv
virtualenv --clear .venv
source .venv/bin/activate
rm -rf .python-libs
linkenv .venv/lib/python2.7/site-packages .python-libs

echo "======= Assets installation (BOWER) ======"
bower install

echo "======= Development libs install (NPM) ======"
npm i --env=prod

echo "======= Prepararing application in DEV MODE ======"
npm run prod
