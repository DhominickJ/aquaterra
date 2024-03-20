
// Project AquaTerra - 

// Project Purpose: To be able to create an IOT device that is capable of communicating between different complimentary devices such as related to gardening.

#include "DHT.h"

#include <WiFi.h>
#include <HTTPClient.h>

const char WIFI_SSID[] = "RemBestGirl";         // CHANGE IT
const char WIFI_PASSWORD[] = "Jackandmyrnasandig@69"; // CHANGE IT

int PORT = 6969;

String HOST_NAME   = "192.168.8.112"; // CHANGE IT to the IP Address of your computer
String PATH_NAME   = "/sensor/data";      // CHANGE IT depending on the call
// Sensor Dependencies 
#define DHTTYPE DHT11

HTTPClient http;

// Light Indicator Pins
#define POWER_PIN 21 // Used for D21 // Understandable
#define WIFI_PIN 18 // Used for Yellow Pin
#define CONNECTED_PIN 19 // Green Pin

// Sensor Pins
#define DHT_PIN 23 // Used for Humidity & Temperature
#define LIGHT_PIN 34 // Used for Photoresistance
#define SOIL_PIN 22 // Used for resistive sensor

// Sensor Dependencies Definition
DHT dht = DHT(DHT_PIN, DHTTYPE);

// Defining the variables for the variable calls
float temperature, humidity;
int daytime_sensor, soil_sensor;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  // Defining the color pins for recognition based on the define macros
  pinMode(POWER_PIN, OUTPUT);
  pinMode(WIFI_PIN, OUTPUT);
  pinMode(CONNECTED_PIN, OUTPUT);

  // Setting up the sensor pins for inputs
  pinMode(LIGHT_PIN, INPUT);
  pinMode(DHT_PIN, INPUT);

  // Starting the Sensors 
  dht.begin();

  // Functions for sensors
  wifiConnect();
}

void loop() {  
  
  // bool successful = true;
  // bool wifi_connected = true;

  // put your main code here, to run repeatedly:
  digitalWrite(POWER_PIN, HIGH);

  
  // Function Commands for Reading
  readSensors();
  sendPOST(temperature, humidity, daytime_sensor, soil_sensor);
  delay(5000);
}

void wifiConnect(){

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
    digitalWrite(WIFI_PIN, HIGH);
    delay(1000);
    digitalWrite(WIFI_PIN, LOW);
  }
  digitalWrite(CONNECTED_PIN, HIGH);
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  // Connecting to the host
  String url = "http://" + HOST_NAME + ":" + String(PORT) + PATH_NAME;
  http.begin(url);
}

void readSensors(){
  delay(1000);

  // Defining the Sensor Types
  humidity = dht.readHumidity();
  temperature = dht.readTemperature();
  daytime_sensor = analogRead(LIGHT_PIN);
  soil_sensor = digitalRead(SOIL_PIN);

  // Serial printing the values needed
  Serial.print("The current air humidity is: ");
  Serial.print(humidity);
  Serial.println("%");
  Serial.print("The current air temperature is: ");
  Serial.print(temperature);
  Serial.println("C");
  Serial.print("The current photoresistance is: ");
  Serial.println(daytime_sensor);
  Serial.print("The current soil sensor: ");
  if (!soil_sensor){
    Serial.println("WET");
  }
  else{
    Serial.println("DRY");
  }
  // Serial.println(soil_sensor);

  if(daytime_sensor >= 100.00){
    Serial.println("\nCurrently it is DAYTIME!");
  }
  else{
    Serial.println("\Currently it is NIGHTTIME!");
  }

}

void sendPOST(float temperature, float humidity, int daytime_sensor, int soil_sensor){
  // delay(2000);
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  String postString = "temperature=" + String(temperature) + "&humidity=" + String(humidity) + "&light_sensor=" + String(daytime_sensor) + "&soil_sensor=" + String(soil_sensor);
  Serial.println(postString);
  int httpCode = http.POST(postString.c_str());
  // Serial.println(http.POST(postString));

  // Error Coding Codes
  // httpCode will be negative on error
  if (httpCode > 0) {
    // file found at server
    if (httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      Serial.println(payload);
    } else {
      // HTTP header has been send and Server response header has been handled
      Serial.printf("[HTTP] POST... code: %d\n", httpCode);
    }
  } else {
    Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
  // delay(5000);
}
