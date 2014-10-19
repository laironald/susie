#include <avr/pgmspace.h>

String readString;

int ledPin = 13;
void setup() 
{
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);      // sets the digital pin as output
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
      Serial.println("switching on, ok?");
      digitalWrite(ledPin, HIGH);   // sets the LED on 
    } else if (readString == "off") {
      Serial.println("switching off, ok?");
      digitalWrite(ledPin, LOW);   // sets the LED low 
    } else {
      Serial.print("This is a string: ");
      Serial.println(readString);
    }
    readString="";
  }   

} 

