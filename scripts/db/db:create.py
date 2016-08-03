from flask_script import Command

class Create(Command):
    "create database"
    def run(self):
        print "database created"
