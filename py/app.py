from flask import Flask, render_template, Response
from flask import request, session
from flask.ext.scss import Scss

import uarm
import json
import uuid # unique identifier
from config import *

# /                = index
# api/listen       = listen to the Serial Port (WIP)
# api/push/<item>  = submit command

app = Flask(__name__, static_folder='static', static_url_path='')
app.debug = True
Scss(app, static_dir='static', asset_dir='assets')

#################
## web app 

@app.route('/')
def index():
  arm = uarm.Arduino()
  active = bool(arm.ser)*1
  return render_template('views/index.html', controller='index', pusherKey=pushrKey, active=active)

# @app.route('/index_<tab>.html')
# def index_main(tab):
#   return render_template('views/index_{0}.html'.format(tab), controller='index')

#################
## commands

# create sketch list
@app.route('/api/sketches')
def sketches():
  import os
  path = os.listdir('../sketches')
  if ".DS_Store" in path:
    path.remove(".DS_Store")
  return Response(json.dumps(path), mimetype='application/javascript')

@app.route('/api/sketches/<sketch>')
def upload(sketch):
  return uarm.upload(sketch)

# create endpoint for authentication
@app.route('/api/auth', methods=['POST'])
def auth():
  arm = uarm.Arduino()
  active = bool(arm.ser)*1
  channelName = request.form['channel_name']
  socketId = request.form['socket_id']
  # RON RON RON
  # at some point make these user_ids unique
  channelData = { 'user_id': socketId }
  channelData['user_info'] = {
    'uuid': str(uuid.uuid1()),
    'arduino': active
  }
  authCode = pushr[channelName].authenticate(socketId, channelData)
  return Response(json.dumps(authCode), mimetype='application/javascript')

@app.route('/api/listen')
def listen():
  # return render_template('views/index.html', method=method, controller=controller)
  # return "".join(uarm.connect(item))
  return uarm.listen()

@app.route('/api/push/<action>')
def push(action):
  pushr[publicChannel].trigger('PUSH-EVENT', {'action': action});
  status = "".join(uarm.push(str(action)))
  pushr[publicChannel].trigger('PUSH-EVENT', {'action': action, 'status': status});
  return status

if __name__ == '__main__':
  app.run()
