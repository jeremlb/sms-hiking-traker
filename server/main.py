from server import create_app
import config


print dir(config)
# initialize the application
app = create_app(config, debug=True)
