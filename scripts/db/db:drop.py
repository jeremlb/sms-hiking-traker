from flask_script import Command

class Create(Command):
    "drop database"
    def run(self):
        print "database droped"
