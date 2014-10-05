/************************************************************************
* File Name          : MotionDemo
* Author             : Evan
* Updated            : Evan
* Version            : V0.0.2
* Date               : 9 June, 2014
* Description        :
* License            : 
* Copyright(C) 2014 UFactory Team. All right reserved.
*************************************************************************/
#include <EEPROM.h>
#include <UF_uArm.h>

UF_uArm uarm;           // initialize the uArm library 
String readString;

/* SET GLOBAL VARIABLES */
int reach = 50;
int rotation = 30;
int d = 50;

int leftServoLast	= 110;
int rightServoLast	= 100;
int rotServoLast	= 90;
int leftServo;
int rightServo;
int rotServo;


void setup() 
{
  Serial.begin(9600);
  int speed = 50;
  uarm.init();          // initialize the uArm position
  uarm.setServoSpeed(SERVO_R, speed);  // 0=full speed, 1-255 slower to faster
  uarm.setServoSpeed(SERVO_L, speed);  // 0=full speed, 1-255 slower to faster
  uarm.setServoSpeed(SERVO_ROT, speed); // 0=full speed, 1-255 slower to faster
  delay(500);
  unsigned char data[3][1000];
  
}

void loop()
{
  /*
  motion();
  motionReturn();
  */
  
  // Convert serial.read() into a useable string using Arduino?
  // http://stackoverflow.com/questions/5697047/convert-serial-read-into-a-useable-string-using-arduino
  // http://stackoverflow.com/questions/24961402/how-to-compare-string-from-serial-read

  while (Serial.available()) {
    delay(3);  
    char c = Serial.read();
    readString += c; 
  }
  if (readString.length() >0) {
    if (readString == "on") {
      Serial.println("switching on");
    } else if (readString == "off") {
      Serial.println("switching on");
    } else if (readString == "hello") { 
      Serial.println("DAVE!");
      Serial.println(readString);
    } else {
      Serial.println(readString);
    }
    readString="";
  }   

//  leftServo = 90;
//  rightServo = 70;
//  rotServo = 60;
//  
//  uarm.servoBufOutL(leftServoLast,  leftServo);
//  uarm.servoBufOutR(rightServoLast, rightServo);
//  uarm.servoBufOutRot(rotServoLast, rotServo);
//
//  leftServoLast = leftServo;
//  rightServoLast = rightServo;
//  rotServoLast = rotServo;




//  double pi = 3.141592653589793;
//  for(double i = 0; i < 100000; i++) {
//    //println(i); 
//    uarm.setPosition(reach/2 + reach/2*cos(i/500), 0, rotation*sin(i/500), 0);
//    //delay(200);
//    Serial.println("This position is " + String(i));   
//  }  
} 

void motion()
{
  
  // reach
  // up
  // right
  // rotate
/*
  
  uarm.setPosition(60, 60, 0, 0);    // stretch out
  delay(200);
  uarm.setPosition(60, 0, 60, 0);    // stretch out
  delay(200);
  uarm.setPosition(60, -45, 0, 0);  // down
  uarm.gripperCatch();               // catch
  delay(400);
  uarm.setPosition(60, 0, 0, 0);    // up
  delay(400);
  uarm.setPosition(60, 0, 25, 0);   // rotate
  delay(400);
  uarm.setPosition(60, -45, 25, 0); // down
  delay(400);
  uarm.gripperRelease();             // release
  delay(100);
  uarm.setPosition(60, 0, 25, 0);   // up
  delay(400);
  uarm.setPosition(0, 0, 25, 0);     
  delay(400);
*/
  uarm.setPosition(0, 0, 25, 60);     
  delay(400);
  uarm.setPosition(0, 0, 25, 20);     
  delay(400);
  uarm.setPosition(0, 0, 25, 80);     
  delay(4000);
  uarm.gripperDirectDetach();        // direct detach 
  delay(5000);
}

void motionReturn()
{
  uarm.setPosition(60, 0, 25, 0);    // stretch out
  delay(400);
  uarm.setPosition(60, -45, 25, 0);  // down
  uarm.gripperCatch();                // catch
  delay(400);
  uarm.setPosition(60, 0, 25, 0);    // up
  delay(400);
  uarm.setPosition(60, 0, 0, 0);     // rotate
  delay(400);
  uarm.setPosition(60, -45, 0, 0);   // down
  delay(400);
  uarm.gripperRelease();              // release
  delay(100);
  uarm.setPosition(60, 0, 0, 0);     // up
  delay(400);
  uarm.setPosition(0, 0, 0, 0);       // original position
  delay(400);
  uarm.gripperDirectDetach();         // direct detach 
  delay(500);
}
