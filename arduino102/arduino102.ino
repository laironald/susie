/*
Sets arm positions based on numeric values coming over serial
This version only echos back values

To set variables, use this format on the serial line
  reach:-5
  height:50
  twist:90
  wrist:-110
  on
  off
*/

#include <avr/pgmspace.h>

#include <EEPROM.h>
#include <UF_uArm.h>
#include <avr/pgmspace.h>

UF_uArm uarm;           // initialize the uArm library 
String ReadString;

/* SET GLOBAL VARIABLES */
// int Reach = 50;
// int Rotation = 30;
// int d = 50;
//int leftServoLast = 110;
//int rightServoLast  = 100;
//int rotServoLast  = 90;
// int ledPin = 13;

int LeftServo = 110;
int RightServo = 100;
int RotServo = 90;
int HandRotServo = 0;




void setup() 
{
  Serial.begin(9600);
  // pinMode(ledPin, OUTPUT);      // sets the digital pin as output

  
  int speed = 50;
  uarm.init();          // initialize the uArm position
  uarm.setServoSpeed(SERVO_R, speed);  // 0=full speed, 1-255 slower to faster
  uarm.setServoSpeed(SERVO_L, speed);  // 0=full speed, 1-255 slower to faster
  uarm.setServoSpeed(SERVO_ROT, speed); // 0=full speed, 1-255 slower to faster
  uarm.setServoSpeed(SERVO_HAND_ROT, speed); // 0=full speed, 1-255 slower to faster

  delay(500);
  
}




void loop()
{
  getData();
  moveArm();
}

void serialGetLine()
{
  ReadString = "";
  while (Serial.available())
  {
    delay(3);  
    char c = Serial.read();
    ReadString += c; 
  }
}


void getData()
{  
  /*
    Convert serial.read() into a useable string using Arduino?
    http://stackoverflow.com/questions/5697047/convert-serial-read-into-a-useable-string-using-arduino
    http://stackoverflow.com/questions/24961402/how-to-compare-string-from-serial-read
  */
  serialGetLine();  // go get string into ReadString global
 
  if (ReadString.length() >0) 
  {
    if (ReadString == "on")
    {
      Serial.println("switching on");
      // digitalWrite(ledPin, HIGH);   // sets the LED on

      LeftServo = 90;
      RightServo = 90;
      RotServo = 70; 
      HandRotServo = 0;     
    } 

    else if (ReadString == "off")
    {
      Serial.println("switching off");
      // digitalWrite(ledPin, LOW);   // sets the LED low 
      
      LeftServo = 110;
      RightServo = 100;
      RotServo = 90;
      HandRotServo = 0;     

    }

    else if (ReadString.substring(0,6) == "reach:")
    {
      LeftServo = ReadString.substring(6).toInt();

    }

    else if (ReadString.substring(0,7) == "height:")
    {
      RightServo = ReadString.substring(7).toInt();

    }

    else if (ReadString.substring(0,6) == "twist:")
    {
      RotServo = ReadString.substring(6).toInt();

    }

    else if (ReadString.substring(0,6) == "wrist:")
    {
      HandRotServo = ReadString.substring(6).toInt();

    }

   
    /*
    rightServo = ReadString.toInt();
    uarm.setPosition(leftServo, rightServo, rotServo, 0); 
    Serial.println(leftServo);
    Serial.println(rightServo);
    Serial.println(rotServo);
    */

  }
  //  ReadString="";
}

void moveArm()
{
  uarm.setPosition(LeftServo, RightServo, RotServo, HandRotServo);

  Serial.print("reach:");
  Serial.print(LeftServo);
  Serial.print("  height:");
  Serial.print(RightServo);
  Serial.print("  twist:");
  Serial.print(RotServo);
  Serial.print("  wrist:");
  Serial.println(HandRotServo);

}
