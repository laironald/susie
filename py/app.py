from flask import Flask, render_template
from flask import request, session
import uarm

app = Flask(__name__, static_folder='static', static_url_path='')
app.debug = True

@app.route('/')
def index():
    method = "index"
    # return render_template('views/index.html', method=method, controller=controller)
    return "".join(uarm.connect())


if __name__ == '__main__':
    app.run()