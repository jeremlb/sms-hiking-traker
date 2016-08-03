from __future__ import absolute_import
from flask_script import Manager
from .. import import_subcommand
from .. import app


manager = Manager(usage="Debug Flask App Tools")
import_subcommand(__name__, __file__, manager)
