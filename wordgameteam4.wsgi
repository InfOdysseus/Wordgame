activate_this = '/home/minsung/Program/python/venv/flask/bin/activate_this.py'
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))
import sys
sys.path.insert(0,"/home/minsung/Program/apache2/")
from wordgameteam4 import app as application