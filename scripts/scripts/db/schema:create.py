from flask_script import Command

class Create(Command):
    "create schema"
    def run(self):
        print "schema created"
