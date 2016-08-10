from __future__ import absolute_import
from flask import render_template

from . import app

@app.route('/')
def index():
    return app.send_static_file("index.html")
