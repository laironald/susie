import serial
import time


# Arduino class

class Arduino:
  import serial.tools.list_ports
  ser = None
  def __init__(self, ser = None):
    self.ser = ser
    if not self.ser:
      self.setSerial()
  def setSerial(self):
    # if segment fault error, use this:
    # http://stackoverflow.com/questions/19531969/segmentation-fault-11-in-os-x
    for sp in serial.tools.list_ports.comports():
      if sp[1] != 'n/a':
        try:
          ser = serial.Serial(sp[0], 9600, timeout=1)
        except:
          ser = None
        if ser:
          self.ser = ser
          break

# Arduino Playground
# http://playground.arduino.cc/Interfacing/Python
def push(item):

  output = None
  arm = Arduino()

  if arm.ser:
    time.sleep(2)

    arm.ser.write(item)
    output = arm.ser.readlines()

    arm.ser.close()
  return output

def upload(sketch):
  import os
  from subprocess import call
  current_dir = os.getcwd()
  os.chdir("../sketches/{0}".format(sketch))
  call(["ino", "build"])
  call(["ino", "upload"])
  os.chdir(current_dir)
  return "ok"


# def listen(item = None):
#   try:
#     serial_port = '/dev/tty.usbmodem1411'
#     ser = serial.Serial(serial_port, 9600, timeout=1)
#   except:
#     serial_port = '/dev/cu.usbserial-A6031NA9'
#     ser = serial.Serial(serial_port, 9600, timeout=1)

#   time.sleep(2)
#   while True:
#     output = ser.readline()
#     if output:
#       break
#   return output