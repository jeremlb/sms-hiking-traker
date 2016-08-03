from __future__ import absolute_import
from scripts import manager, app

if __name__ == '__main__':
    with app.app_context():
        manager.run()
