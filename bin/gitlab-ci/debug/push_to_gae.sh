export KEY_FILE=$(<bin/debug/credentials.json)
export PROJECT_ID=integration-continue
export GCLOUD_ACCOUNT=deployement@integration-continue.iam.gserviceaccount.com

./bin/before_scripts/gcloud_install.sh
./bin/deploy/app_engine.sh
