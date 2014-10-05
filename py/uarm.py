import serial

ser = serial.Serial('/dev/cu.usbserial-A6031NA9', 9600, timeout=1)
print ser.name

ser.write("hello")

# ----------------

s = ser.read(10)
print s
line = ser.readline()
print line

s = ser.read(10)
print s
line = ser.readline()
print line

# ser.close()