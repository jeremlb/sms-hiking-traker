export ACCOUNT            = testestoespt@glassy-proton-132423.iam.gserviceaccount.com
export KEY_FILE           = test-82408669567b.json
export PROJECT_ID         = my-project
export APP_ENGINE_VERSION = 1

gcloud auth activate-service-account $ACCOUNT --key-file $KEY_FILE
gcloud config set project $PROJECT_ID
gcloud config set account $ACCOUNT

gcloud preview app deploy --version $APP_ENGINE_VERSION

gcloud config unset account
gcloud config unset project
