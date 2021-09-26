#include <OneButton.h>
#define BUTTON_PIN  0

OneButton button(BUTTON_PIN, true);

#include <MPU9250_asukiaaa.h>

#ifdef _ESP32_HAL_I2C_H_
#define SDA_PIN 21
#define SCL_PIN 22
#endif

MPU9250_asukiaaa mySensor;
float aX, aY, aZ, aSqrt, gX, gY, gZ, mDirection, mX, mY, mZ;

#define BLACK 0x0000
#define WHITE 0xFFFF
#define GREY  0x5AEB
#include <TFT_eSPI.h> // Graphics and font library for ST7735 driver chip
#include <SPI.h>
TFT_eSPI tft = TFT_eSPI();
char buff[512];
float G = 0.9807;
int endacc[3] = {0, 0, 0};
float S[3] = {1, 1, 1};
float Ab[3] = {0, 0, 0};
float Gb[3] = {0, 0, 0};
int ndata = 200;

//Grafcet state
bool x0, x1, x2, x3, x4, x5, x6;
bool UUID_found = 0, data_quility = 1, printstate = 1;
void grafcet(void);
void active(void);
const String server_ip = "192.168.0.108:8000";
const String Device_ID = "IMU1"; //Custom device ID


#include <WiFiManager.h>
#include "files.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
char* device_id = "1";
String UUID = "";

void setup() {
  // serial to display data
  x0 = 1;
  x1 = 0;
  x2 = 0;
  x3 = 0;
  x4 = 0;
  x5 = 0;
  x6 = 0;

  //  tft.init();
  //  tft.setRotation(3);
  //  tft.fillScreen((0x0000));
  //  tft.setCursor(0, 0, 2);
  //  tft.setTextColor(TFT_WHITE, TFT_BLACK);
  //  tft.setTextSize(2);
  //  tft.setTextSize(2);
  //  snprintf(buff,sizeof(buff),"IMU");
  //  tft.drawString(buff,70,0);
  //  tft.setTextSize(1);
  //  snprintf(buff,sizeof(buff),"Calibration...");
  //  tft.drawString(buff,0,120);


  Serial.begin(115200);
  button.attachClick(enterDeepSleep);

  //  while(!Serial);
  //  Serial.println("started");
  //#ifdef _ESP32_HAL_I2C_H_ // For ESP32
  //  Wire.begin(SDA_PIN, SCL_PIN);
  //  mySensor.setWire(&Wire);
  //#endif
  //  mySensor.beginAccel();
  //  mySensor.beginGyro();
  //  mySensor.beginMag();
  //
  //
  //
  //  snprintf(buff,sizeof(buff),"START Calibration GYRO");
  //  tft.drawString(buff,0,40);
  //
  //  for(int i=0;i<ndata;i++){
  //     if (mySensor.gyroUpdate() == 0) {
  //        Gb[0]+=mySensor.gyroX();
  //        Gb[1]+=mySensor.gyroY();
  //        Gb[2]+=mySensor.gyroZ();
  //        Serial.print(i);
  //        Serial.print(": ");
  //        Serial.println(Gb[0]);
  //        delay(70);
  //     }
  //  }
  //  Gb[0]/=ndata;
  //  Gb[1]/=ndata;
  //  Gb[2]/=ndata;
  //  Serial.print(Gb[0]);
  //  Serial.print("\t");
  //  Serial.print(Gb[1]);
  //  Serial.print("\t");
  //  Serial.print(Gb[2]);
  //  Serial.print("\n\n");
  //
  //  snprintf(buff,sizeof(buff),"Calibration GYRO DONE!    ");
  //  tft.drawString(buff,0,40);
  ////  //find calibration postion
  ////
  //  snprintf(buff,sizeof(buff),"Calibration ACC-X");
  //  tft.drawString(buff,0,60);
  //  snprintf(buff,sizeof(buff),"Calibration ACC-Y");
  //  tft.drawString(buff,0,80);
  //   snprintf(buff,sizeof(buff),"Calibration ACC-Z");
  //  tft.drawString(buff,0,100);
  //  float T=0.9,H=-0.9;
  //  int pos=0;
  //  while(1){
  //      for(int i =0;i<50;i++){
  //        if (mySensor.accelUpdate() == 0) {
  //          aX+=mySensor.accelX();
  //          aY+=mySensor.accelY();
  //          aZ+=mySensor.accelZ();
  //        }
  //      }
  //      aX/=50;
  //      aY/=50;
  //      aZ/=50;
  //
  //      if(abs(aX)>abs(aY)&&abs(aX)>abs(aZ)){
  //       //X方向
  //       snprintf(buff,sizeof(buff),"START Calibration ACC-X");
  //       tft.drawString(buff,0,60);
  //       pos=0;
  //      }else if(abs(aY)>abs(aX)&&abs(aY)>abs(aZ)){
  //       //Y方向
  //       snprintf(buff,sizeof(buff),"START Calibration ACC-Y");
  //       tft.drawString(buff,0,80);
  //       pos=1;
  //      }else if(abs(aZ)>abs(aY)&&abs(aZ)>abs(aX)){
  //       //Z方向
  //       snprintf(buff,sizeof(buff),"START Calibration ACC-Z");
  //       tft.drawString(buff,0,100);
  //       pos=2;
  //      }
  //      float ab[3]={0,0,0};
  //       for(int i=0;i<ndata;i++){
  //         //校正開始
  //         if (mySensor.accelUpdate() == 0) {
  //           ab[0]+=(mySensor.accelX()/S[0])+Ab[0];
  //           ab[1]+=(mySensor.accelY()/S[1])+Ab[0];
  //           ab[2]+=(mySensor.accelZ()/S[2])+Ab[0];
  //         }
  //         //若突然換方向要及時發現並重新轉到那個方向校正
  //
  //       }
  //       Ab[0]=ab[0]/ndata;
  //       Ab[1]=ab[1]/ndata;
  //       Ab[2]=ab[2]/ndata;
  //       if (mySensor.accelUpdate() == 0) {
  //         S[2]=G/Ab[2];
  //         aZ=S[2]*(mySensor.accelZ()- Ab[2])+G;
  //       }
  //       Serial.println("=-------------=");
  //       if (aZ-G<0.02){
  //        break;
  //       }
  //  }
  //
  //
  //  delay(1000);
  //  tft.fillScreen((0x0000));
  //  tft.setTextSize(1);
  //  tft.setTextColor(TFT_WHITE, TFT_BLACK);
  if (!SPIFFS.begin(FORMAT_SPIFFS_IF_FAILED)) {
    Serial.println("SPIFFS Mount Failed");
    return;
  }
  writeFile(SPIFFS, "/UUID.txt", "");
}

void enterDeepSleep() {
  writeFile(SPIFFS, "/UUID.txt", "");
#define ST7735_DISPOFF 0x28
#define ST7735_DISPON 0x29
#define ST7735_SLPIN 0x10
  tft.writecommand(ST7735_DISPOFF);
  tft.writecommand(ST7735_SLPIN);
  esp_sleep_enable_ext1_wakeup(GPIO_SEL_0, ESP_EXT1_WAKEUP_ALL_LOW);
  esp_deep_sleep_start();
}


void loop() {
  // read the sensor
  // display the data
  //    button.tick();
  //    uint8_t sensorId;
  //    if (mySensor.readId(&sensorId) == 0) {
  //    } else {
  //      Serial.println("Cannot read sensorId");
  //    }
  //
  //    if (mySensor.accelUpdate() == 0) {
  //      aX = mySensor.accelX();
  //      aY = mySensor.accelY();
  //      aZ = mySensor.accelZ();
  //      aZ=S[2]*(mySensor.accelZ()- Ab[2])+G+0.02;
  //      aSqrt = mySensor.accelSqrt();
  ////      Serial.println("accelX: " + String(aX));
  ////      Serial.println("accelY: " + String(aY));
  ////      Serial.println("accelZ: " + String(aZ));
  ////      Serial.println("accelSqrt: " + String(aSqrt));
  //
  ////      Serial.print(G*aX);
  ////      Serial.print(",");
  ////      Serial.print(G*aY);
  ////      Serial.print(",");
  ////      Serial.print(G*aZ);
  ////      Serial.print(",");
  //      snprintf(buff,sizeof(buff),"ax : %.3f  ",G*aX);
  //      tft.drawString(buff,0,0);
  //      snprintf(buff,sizeof(buff),"ay : %.3f  ",G*aY);
  //      tft.drawString(buff,0,60);
  //      snprintf(buff,sizeof(buff),"az : %.3f  ",G*aZ);
  //      tft.drawString(buff,0,100);
  //    } else {
  //      Serial.println("Cannod read accel values");
  //      snprintf(buff,sizeof(buff),"ax : nan");
  //      tft.drawString(buff,0,0);
  //      snprintf(buff,sizeof(buff),"ay : nan");
  //      tft.drawString(buff,0,60);
  //      snprintf(buff,sizeof(buff),"az : nan");
  //      tft.drawString(buff,0,100);
  //    }
  //
  //    if (mySensor.gyroUpdate() == 0) {
  //      gX = mySensor.gyroX();
  //      gY = mySensor.gyroY();
  //      gZ = mySensor.gyroZ();
  //      gX-=Gb[0];
  //      gY-=Gb[1];
  //      gZ-=Gb[2];
  ////      Serial.println("gyroX: " + String(gX));
  ////      Serial.println("gyroY: " + String(gY));
  ////      Serial.println("gyroZ: " + String(gZ));
  //      Serial.print(gX);
  //      Serial.print(",");
  //      Serial.print(gY);
  //      Serial.print(",");
  //      Serial.print(gZ);
  //      snprintf(buff,sizeof(buff),"gx : %.3f       ",gX);
  //      tft.drawString(buff,120,0);
  //      snprintf(buff,sizeof(buff),"gy : %.3f       ",gY);
  //      tft.drawString(buff,120,60);
  //      snprintf(buff,sizeof(buff),"gz : %.3f       ",gZ);
  //      tft.drawString(buff,120,100);
  //    } else {
  //      Serial.println("Cannot read gyro values");
  //      snprintf(buff,sizeof(buff),"gx : nan",gX);
  //      tft.drawString(buff,120,0);
  //      snprintf(buff,sizeof(buff),"gy : nan",gY);
  //      tft.drawString(buff,120,60);
  //      snprintf(buff,sizeof(buff),"gz : nan",gZ);
  //      tft.drawString(buff,120,100);
  //    }
  //    Serial.println();
  grafcet();
  delay(1000);
}


void grafcet() {
  action();
  if (x0 == 1) {
    x0 = 0;
    x1 = 1;
  } else if (x1 == 1) {
    x1 = 0;
    x2 = 1;
  } else if (x2 == 1) {
    if (UUID_found == 1) {
      x2 = 0;
      x3 = 1;
    } else {
      x2 = 0;
      x4 = 1;
    }
  } else if (x3 == 1) {
    x3 = 0;
    x5 = 1;
  } else if (x4 == 1) {
    x4 = 0;
    x2 = 1;
  } else if (x5 == 1) {
    if (data_quility == 1) {
      x5 = 0;
      x6 = 1;
    } else {
      x5 = 0;
      x3 = 1;
    }
  } else if (x6 == 1) {
    x6 = 0;
    x5 = 1;
  }

}

void action() {
  if (x0 == 1) {
    if (printstate)Serial.println("X0:start");
  }
  if (x1 == 1) {
    if (printstate)Serial.println("X1:WifiManager");
    WiFi.mode(WIFI_STA);
    WiFiManager wm;
    bool res;
    res = wm.autoConnect(device_id, "password"); // password protected ap

    if (!res) {
      Serial.println("Failed to connect");
      // ESP.restart();
    }
    else {
      //if you get here you have connected to the WiFi
      Serial.println("connected...yeey :)");
    }
  }
  if (x2 == 1) {
    if (printstate)Serial.println("X2:Check Sensor Group UUID");

    listDir(SPIFFS, "/", 0);
    UUID = returnFile(SPIFFS, "/UUID.txt");
    if (UUID == "") {
      Serial.println("[SYS] Found UUID: Fail");
      UUID_found = 0;
    } else {
      Serial.print("[SYS] Found UUID: ");
      Serial.println(UUID);
      UUID_found = 1;
    }

  }
  if (x3 == 1) {
    if (printstate)Serial.println("X3:Build-in Calibration");

  }
  if (x4 == 1) {
    if (printstate)Serial.println("X4:Get UUID from Server");
    if ((WiFi.status() == WL_CONNECTED)) {
      HTTPClient http;
      http.begin("http://" + server_ip + "/get_api/" + Device_ID);
      int httpCode = http.GET();
      if (httpCode > 0) {
        String payload = http.getString();
        StaticJsonDocument<200> doc;
        deserializeJson(doc, payload);
        const char* id = doc["Device_ID"];
        char* uuid = doc["UUID"];
        UUID=String(uuid);
        Serial.print(id);
        Serial.print(",");
        Serial.println(UUID);
      }
    }
    writeFile(SPIFFS, "/UUID.txt", UUID);
    Serial.println("[SYS] GET UUID Done.");
    UUID_found = 1;
  }
  if (x5 == 1) {
    if (printstate)Serial.println("X5:Data capture");

  }
  if (x6 == 1) {
    if (printstate)Serial.println("X6:POST Data to Server & clean memory");
  }
}
