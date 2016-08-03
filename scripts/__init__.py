from __future__ import absolute_import
import os, sys, inspect
from os import path

sys.path.insert(1, os.path.join(os.path.dirname(__file__), '..'))
#
# print os.path.join(os.path.dirname(__file__), '../server')

from flask_script import Manager
from server import create_app

app = create_app()

app.config['DEBUG'] = True

manager = Manager(app)

def import_command(module, filename, manager):
    sub_module_name = module + '.' + filename
    __import__(sub_module_name)

    for name, obj in inspect.getmembers(sys.modules[sub_module_name]):
        if inspect.isclass(obj) and obj.__module__ == sub_module_name:
            command_name = obj.__command__ if hasattr(obj, '__command__') else filename
            manager.add_command(command_name, obj())

def import_subcommand(module_name, file_dir, manager):
    for file in os.listdir(os.path.dirname(file_dir)):
        if path.isfile(os.path.join(os.path.dirname(file_dir), file)):
            filename, extension = os.path.splitext(file)
            if extension == '.py' and filename != '__init__':
                import_command(module_name, filename, manager)

        elif path.isdir(os.path.join(os.path.dirname(file_dir), file)):
            mod = getattr(__import__(module_name + '.' + file), file)
            manager.add_command(str(file), mod.manager)

import_subcommand(__name__, __file__, manager)
