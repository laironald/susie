from flask import Flask, render_template
from flask import request, session
from flask.ext.scss import Scss

import uarm
from config import pushr, pushr_key

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
  return render_template('views/index.html', controller='index', pusher_key=pushr_key, active=active)

# @app.route('/index_<tab>.html')
# def index_main(tab):
#   return render_template('views/index_{0}.html'.format(tab), controller='index')

#################
## commands

@app.route('/api/listen')
def listen():
  # return render_template('views/index.html', method=method, controller=controller)
  # return "".join(uarm.connect(item))
  return uarm.listen()

@app.route('/api/push/<action>')
def push(action):
  pushr['app-channel'].trigger('PUSH-EVENT', {'action': action});
  status = uarm.push(str(action))
  if status:
    status = "".join(status)
  else:
    status = "device is not connected"
  pushr['app-channel'].trigger('PUSH-EVENT', {'action': action, 'status': status});
  return status

if __name__ == '__main__':
  app.run()