from flask import Flask , render_template
from flask_socketio import SocketIO, send
count = 0
rooms = {}

app = Flask(__name__)
app.config['SECRET_KEY'] = 'BCODE_Flask'
socketio = SocketIO(app)

@app.route("/game")
def main():
    return render_template("client.html", count = count)

@app.route("/home")
def home():
    return render_template("home.html")

def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')

@socketio.on('my event')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('received my event: ' + str(json))
    socketio.emit('my response', json, callback=messageReceived)

if __name__ == '__main__':
    #socketio.run(app, host = "127.0.0.1", debug=True, port=5000)
    socketio.run(app)
