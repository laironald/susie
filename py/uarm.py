import serial
import time

# Arduino Playground
# http://playground.arduino.cc/Interfacing/Python
def push(item):
  try:
    serial_port = '/dev/tty.usbmodem1411'
    ser = serial.Serial(serial_port, 9600, timeout=1)
  except:
    serial_port = '/dev/cu.usbserial-A6031NA9'
    ser = serial.Serial(serial_port, 9600, timeout=1)

  time.sleep(2)
  output = []
  ser.write(item)
  output.append(ser.readline())

  ser.close()
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