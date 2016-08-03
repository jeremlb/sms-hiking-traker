from __future__ import absolute_import
from flask_script import Manager
from .. import import_subcommand


manager = Manager(usage="Database Tools Scripts")
import_subcommand(__name__, __file__, manager)
