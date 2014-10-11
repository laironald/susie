from flask import Flask, render_template
from flask import request, session
import uarm

# /             = index
# /listen       = listen to the Serial Port (WIP)
# /push/<item>  = submit command


app = Flask(__name__, static_folder='static', static_url_path='')
app.debug = True

@app.route('/')
def index():
    # return render_template('views/index.html', method=method, controller=controller)
    return "hello"

@app.route('/listen')
def listen():
    # return render_template('views/index.html', method=method, controller=controller)
    # return "".join(uarm.connect(item))
    return uarm.listen()

@app.route('/push/<item>')
def push(item):
    # return render_template('views/index.html', method=method, controller=controller)
    # return "".join(uarm.connect(item))
    return "".join(uarm.push(str(item)))

if __name__ == '__main__':
    app.run()