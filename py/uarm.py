import serial
import time

# Arduino Playground
# http://playground.arduino.cc/Interfacing/Python

serial_port = '/dev/cu.usbserial-A6031NA9'
serial_port = '/dev/tty.usbmodem1411'

ser = serial.Serial(serial_port, 9600, timeout=1)
time.sleep(2)
print ser.name

ser.write("on")
print ser.readline()

# ----------------

ser.write("off")
print ser.readline()


ser.close()