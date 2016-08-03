from flask_script import Command

class Create(Command):
    "update schema"
    def run(self):
        print "schema updated"
