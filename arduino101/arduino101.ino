#include <avr/pgmspace.h>

String readString;

void setup() 
{
  Serial.begin(9600);
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
    } else if (readString == "off") {
      Serial.println("switching off");
    } else {
      Serial.print("This is a string: ");
      Serial.println(readString);
    }
    readString="";
  }   

} 

