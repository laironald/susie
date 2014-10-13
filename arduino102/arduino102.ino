/*
Sets arm positions based on numeric values coming over serial

To set variables, use this format on the serial line
  mode:led
  mode:arm
  led:on
  led:off
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

#define LED_MODE  0
#define ARM_MODE  1


UF_uArm uarm;           // initialize the uArm library 
String ReadString;

/* SET GLOBAL VARIABLES */
int LEDPin = 13;
int LEDValue = LOW;
int LeftServo = 110;
int RightServo = 100;
int RotServo = 90;
int HandRotServo = 0;
int Mode = LED_MODE;



void setup() 
{
  Serial.begin(9600);
  pinMode(LEDPin, OUTPUT);      // sets the digital pin as output

  
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
  if(getData())
  {
    doAction();
  }
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


boolean getData()
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

      LEDValue = HIGH;
      LeftServo = 90;
      RightServo = 90;
      RotServo = 70; 
      HandRotServo = 0;     
    } 

    else if (ReadString == "off")
    {
      Serial.println("switching off");
      
      LEDValue = LOW;
      LeftServo = 110;
      RightServo = 100;
      RotServo = 90;
      HandRotServo = 0;     
    }

    else if (ReadString.substring(0,5) == "mode:")
    {
      if (ReadString.substring(5) == "led")
      {
        Mode=LED_MODE;
      }
      else if (ReadString.substring(5) == "arm")
      {
        Mode=ARM_MODE;
      }
    }

    else if (ReadString.substring(0,4) == "led:")
    {
      if (ReadString.substring(4) == "on")
      {
        LEDValue = true;
      }
      else if (ReadString.substring(4) == "off")
      {
        LEDValue = false;
      }
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

    return true;  // did have data
  }
  
  else
  {
    return false;  // did not have data
  }

}

void doAction()
{
  if (Mode == ARM_MODE)
  {
    uarm.setPosition(LeftServo, RightServo, RotServo, HandRotServo);
  }
  else if (Mode == LED_MODE)
  {
    digitalWrite(LEDPin, LEDValue);   // sets the LED
  }

  Serial.print("reach:");
  Serial.print(LeftServo);
  Serial.print("  height:");
  Serial.print(RightServo);
  Serial.print("  twist:");
  Serial.print(RotServo);
  Serial.print("  wrist:");
  Serial.print(HandRotServo);
  Serial.print("  led:");
  Serial.println(LEDValue);
}
