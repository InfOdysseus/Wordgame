from flask import Flask , render_template, session
from flask_socketio import SocketIO, emit
import random, os    
app = Flask(__name__)
app.config['SECRET_KEY'] = 'BCODE_Flask'
socketio = SocketIO(app)
wordParse = [ 'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ' ]
word = random.choice(wordParse) + random.choice(wordParse) 
rooms = {}
user_no = 1

@app.before_request
def before_request():
    global user_no
    if 'session' in session and 'user-id' in session:
        pass

    else:
        session['session'] = os.urandom(24)
        session['username'] = 'user'+str(user_no)


@app.route("/game")
def main():
    global user_no
    user_no += 1
    return render_template("client.html", word = word)

@app.route("/home")
def home():
    return render_template("home.html")

@socketio.on('connect')
def connect():
    emit("response", {'data': 'Connected', 'username': session['username']})


@socketio.on('disconnect')
def disconnect():
    session.clear()
    print("Disconnected")

@socketio.on("request")
def request(message):
    emit("response", {'data': message['data'], 'username': session['username']}, broadcast=True)

if __name__ == '__main__':
    #socketio.run(app, host = "127.0.0.1", debug=True, port=5000)
    socketio.run(app, port = 8080)


