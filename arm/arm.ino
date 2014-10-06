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
#include <avr/pgmspace.h>

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

prog_int16_t data[94][3] PROGMEM = {
  
  {86, 103, 90}, 
  
  {86, 103, 90}, 
  
  {86, 103, 90}, 
  
  {86, 103, 90}, 
  
  {86, 103, 90}, 
  
  {86, 103, 90}, 
  
  {86, 103, 90}, 
  
  {86, 103, 90}, 
  
  {86, 103, 91}, 
  
  {86, 103, 90}, 
  
  {86, 103, 89}, 
  
  {86, 103, 91}, 
  
  {86, 103, 91}, 
  
  {86, 102, 91}, 
  
  {86, 102, 90}, 
  
  {85, 101, 90}, 
  
  {83, 98, 90}, 
  
  {81, 94, 90}, 
  
  {80, 90, 90}, 
  
  {80, 87, 90}, 
  
  {81, 83, 90}, 
  
  {82, 79, 90}, 
  
  {85, 75, 90}, 
  
  {87, 71, 90}, 
  
  {88, 65, 90}, 
  
  {89, 60, 89}, 
  
  {91, 56, 89}, 
  
  {92, 53, 89}, 
  
  {92, 51, 89}, 
  
  {92, 50, 89}, 
  
  {92, 51, 89}, 
  
  {92, 51, 89}, 
  
  {92, 51, 89}, 
  
  {92, 51, 87}, 
  
  {92, 51, 83}, 
  
  {92, 51, 77}, 
  
  {92, 51, 72}, 
  
  {92, 51, 67}, 
  
  {92, 52, 63}, 
  
  {92, 53, 58}, 
  
  {92, 56, 56}, 
  
  {92, 60, 54}, 
  
  {92, 65, 53}, 
  
  {92, 71, 54}, 
  
  {92, 76, 57}, 
  
  {92, 81, 60}, 
  
  {91, 84, 64}, 
  
  {90, 87, 67}, 
  
  {87, 87, 68}, 
  
  {82, 85, 68}, 
  
  {76, 84, 67}, 
  
  {70, 82, 67}, 
  
  {65, 79, 67}, 
  
  {61, 76, 67}, 
  
  {58, 74, 68}, 
  
  {55, 71, 70}, 
  
  {55, 67, 72}, 
  
  {55, 63, 73}, 
  
  {55, 59, 74}, 
  
  {56, 56, 74}, 
  
  {57, 52, 75}, 
  
  {60, 49, 75}, 
  
  {61, 45, 75}, 
  
  {64, 42, 75}, 
  
  {66, 39, 75}, 
  
  {70, 38, 76}, 
  
  {74, 38, 79}, 
  
  {78, 38, 83}, 
  
  {83, 38, 87}, 
  
  {88, 39, 91}, 
  
  {91, 40, 94}, 
  
  {95, 40, 96}, 
  
  {97, 41, 99}, 
  
  {99, 44, 101}, 
  
  {99, 48, 100}, 
  
  {99, 52, 100}, 
  
  {99, 56, 100}, 
  
  {99, 60, 100}, 
  
  {99, 64, 100}, 
  
  {99, 67, 99}, 
  
  {99, 68, 99}, 
  
  {99, 71, 99}, 
  
  {99, 72, 98}, 
  
  {99, 72, 98}, 
  
  {99, 73, 98}, 
  
  {99, 73, 98}, 
  
  {99, 73, 98}, 
  
  {99, 73, 98}, 
  
  {100, 73, 98}, 
  
  {100, 73, 98}, 
  
  {100, 73, 98}, 
  
  {100, 73, 98}, 
  
  {100, 73, 98}, 
  
  {100, 73, 97}, 
  
  };

void setup() 
{
  Serial.begin(9600);
  int speed = 50;
  uarm.init();          // initialize the uArm position
  uarm.setServoSpeed(SERVO_R, speed);  // 0=full speed, 1-255 slower to faster
  uarm.setServoSpeed(SERVO_L, speed);  // 0=full speed, 1-255 slower to faster
  uarm.setServoSpeed(SERVO_ROT, speed); // 0=full speed, 1-255 slower to faster
  delay(500);
  // unsigned char data[3][1000];
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
      playBack();
    } else if (readString == "off") {
      Serial.println("switching off");
    } else {
      Serial.print("This is a string: ");
      Serial.println(readString);
    }
    readString="";
  }   

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

void playBack() 
{
////    Serial.println(data[0][0]);
////    Serial.println(data[0][1]);
////    Serial.println(data[0][2]);
////    Serial.println(data[1][0]);
////    Serial.println(data[1][1]);
////    Serial.println(data[1][2]);
////    
//    for(int i = 0; i < 100; i++) {
//      uarm.servoBufOutL(leftServoLast,  i);
//      leftServoLast = i;
//    }
//    for(int i = 0; i < 100; i++) {
//      uarm.servoBufOutR(rightServoLast,  i);
//      rightServoLast = i;
//    }
//    for(int i = 0; i < 90; i++) {

//    }


  for(int i = 0; i < 90; i++) {
      Serial.println(data[i][0]);
      Serial.println(data[i][1]);
      Serial.println(data[i][2]);
    uarm.servoBufOutL(leftServoLast,  data[i][0]);
    uarm.servoBufOutR(rightServoLast, data[i][1]);
    uarm.servoBufOutRot(rotServoLast, data[i][2]);
    
    leftServoLast  = data[i][0];
    rightServoLast = data[i][1];
    rotServoLast   = data[i][2];
    delay(d);
  }

}
