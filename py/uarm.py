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

def upload(sketch, directory = "../sketches"):
  import os
  from subprocess import call
  current_dir = os.getcwd()
  os.chdir("{0}/{1}".format(directory, sketch))
  call(["ino", "build"])
  call(["ino", "upload"])
  os.chdir(current_dir)
  return "ok"

def record(start="start", stop="stop", outfile="ron"):
  import io
  import os

  if not os.path.exists("../sketches/{0}/src".format(outfile)):
    os.makedirs("../sketches/{0}/src".format(outfile))
    os.makedirs("../sketches/{0}/lib".format(outfile))
  f = open("../sketches/{0}/src/sketch.ino".format(outfile), "wrb")
  f.write("""
String readString;
void setup() 
{
  Serial.begin(9600);
}

void loop()
{
  while (Serial.available()) {
    delay(3);  
    char c = Serial.read();
    readString += c; 
  }
  if (readString.length() > 0) {
    if (readString == "on") {
    """)

  output = None
  arm = Arduino()
  if arm.ser:
    time.sleep(2)

    arm.ser.write(start)

    ser = arm.ser
    sio = io.TextIOWrapper(io.BufferedRWPair(ser, ser))

    sio.write(unicode("start"))

    i = 0
    while True:
      line = sio.readline()[:-1]
      if line == "stop":
        break
      time.sleep(0.1)
      print i, line
      f.write(line)
      f.write("\n")
      i += 1

    sio.flush()
    arm.ser.close()

  f.write("""
    }
    readString="";
  }
} 
    """)
  f.close()

  return output


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