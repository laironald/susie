from flask import Flask, render_template
from flask import request, session
import uarm

app = Flask(__name__, static_folder='static', static_url_path='')
app.debug = True

@app.route('/')
def index():
    # return render_template('views/index.html', method=method, controller=controller)
    return "".join(uarm.connect())

@app.route('/<item>')
def actions(item):
    # return render_template('views/index.html', method=method, controller=controller)
    # return "".join(uarm.connect(item))
    return "".join(uarm.connect(str(item)))


if __name__ == '__main__':
    app.run()