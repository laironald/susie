#include <avr/pgmspace.h>

#include <EEPROM.h>
#include <UF_uArm.h>
#include <avr/pgmspace.h>

UF_uArm uarm;           // initialize the uArm library 
String readString;

/* SET GLOBAL VARIABLES */
int reach = 50;
int rotation = 30;
int d = 50;

int leftServoLast = 110;
int rightServoLast  = 100;
int rotServoLast  = 90;
int leftServo;
int rightServo;
int rotServo;

int ledPin = 13;


void setup() 
{
  Serial.begin(9600);
  // pinMode(ledPin, OUTPUT);      // sets the digital pin as output

  
  int speed = 50;
  uarm.init();          // initialize the uArm position
  uarm.setServoSpeed(SERVO_R, speed);  // 0=full speed, 1-255 slower to faster
  uarm.setServoSpeed(SERVO_L, speed);  // 0=full speed, 1-255 slower to faster
  uarm.setServoSpeed(SERVO_ROT, speed); // 0=full speed, 1-255 slower to faster
  delay(500);
  
}

void loop()
{
  /*
  motion();
  motionReturn();
  */
  
  /*
    Convert serial.read() into a useable string using Arduino?
    http://stackoverflow.com/questions/5697047/convert-serial-read-into-a-useable-string-using-arduino
    http://stackoverflow.com/questions/24961402/how-to-compare-string-from-serial-read
  */

  while (Serial.available()) {
    delay(3);  
    char c = Serial.read();
    readString += c; 
  }
  if (readString.length() >0) {
    if (readString == "on") {
      Serial.println("switching on");
      // digitalWrite(ledPin, HIGH);   // sets the LED on
      uarm.setPosition(60, 60, 0, 0); 

    } else if (readString == "off") {
      Serial.println("switching off");
      // digitalWrite(ledPin, LOW);   // sets the LED low 
      uarm.setPosition(100 , 100, 20, 0); 


    } else {
      Serial.print("This is a string: ");
      Serial.println(readString);
      Serial.print("Servo positions: ")
      Serial.print
    }
    readString="";
  }   

} 
