from __future__ import absolute_import

app = None

def init_app(appli):
    global app

    app = appli
    
    from .index import *

    # import blueprint
    # from .api_log         import crud_log
    # app.register_blueprint(crud_log,         url_prefix='/api')
