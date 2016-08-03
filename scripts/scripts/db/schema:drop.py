from flask_script import Command

class Create(Command):
    "drop schema"
    def run(self):
        print "schema droped"
