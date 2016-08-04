from __future__ import absolute_import
import logging
from flask import Flask

def create_app(config=None, debug=False, testing=False, config_overrides=None):
    """ Create the flask application
        Args:
            config flask configuration (python file)
            debug flask app mode
            testing flask app mode
            config_overrides a dictionary given if config has to be overrides
    """
    app = Flask(__name__)

    if config is not None:
        app.config.from_object(config)

    app.debug = debug
    app.testing = testing

    # import controllers
    from .controllers import init_app

    # load all routes with controllers
    init_app(app)

    if config_overrides:
        app.config.update(config_overrides)

    # Configure logging
    if not app.testing:
        logging.basicConfig(level=logging.INFO)

    # Add an error handler. This is useful for debugging the live application,
    # however, you should disable the output of the exception for production
    # applications.
    @app.errorhandler(500)
    def server_error(e):
        return """
        An internal error occurred: <pre>{}</pre>
        See logs for full stacktrace
        """.format(e), 500

    return app
