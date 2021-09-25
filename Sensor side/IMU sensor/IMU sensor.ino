
#include <OneButton.h>
#define BUTTON_PIN  0

OneButton button(BUTTON_PIN,true);

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
  int endacc[3]={0,0,0};
  float S[3]={1,1,1};
  float Ab[3]={0,0,0};
  float Gb[3]={0,0,0};
int ndata=200;
void setup() {
  // serial to display data
  tft.init();
  tft.setRotation(3);
  tft.fillScreen((0x0000));
  tft.setCursor(0, 0, 2);
  tft.setTextColor(TFT_WHITE, TFT_BLACK);  
  tft.setTextSize(2);
  tft.setTextSize(2);
  snprintf(buff,sizeof(buff),"IMU");
  tft.drawString(buff,70,0);
  tft.setTextSize(1);
  snprintf(buff,sizeof(buff),"Calibration...");
  tft.drawString(buff,0,120);
  
  
  Serial.begin(115200);
  button.attachClick(enterDeepSleep);

  while(!Serial);
  Serial.println("started");
#ifdef _ESP32_HAL_I2C_H_ // For ESP32
  Wire.begin(SDA_PIN, SCL_PIN);
  mySensor.setWire(&Wire);
#endif
  mySensor.beginAccel();
  mySensor.beginGyro();
  mySensor.beginMag();

  
  
  snprintf(buff,sizeof(buff),"START Calibration GYRO");
  tft.drawString(buff,0,40);
  
  for(int i=0;i<ndata;i++){
     if (mySensor.gyroUpdate() == 0) {
        Gb[0]+=mySensor.gyroX();
        Gb[1]+=mySensor.gyroY();
        Gb[2]+=mySensor.gyroZ();
        Serial.print(i);
        Serial.print(": ");
        Serial.println(Gb[0]);
        delay(70);
     }
  }
  Gb[0]/=ndata;
  Gb[1]/=ndata;
  Gb[2]/=ndata;
  Serial.print(Gb[0]);
  Serial.print("\t");
  Serial.print(Gb[1]);
  Serial.print("\t");
  Serial.print(Gb[2]);
  Serial.print("\n\n");

  snprintf(buff,sizeof(buff),"Calibration GYRO DONE!    ");
  tft.drawString(buff,0,40);
//  //find calibration postion
//  
  snprintf(buff,sizeof(buff),"Calibration ACC-X");
  tft.drawString(buff,0,60);
  snprintf(buff,sizeof(buff),"Calibration ACC-Y");
  tft.drawString(buff,0,80);
   snprintf(buff,sizeof(buff),"Calibration ACC-Z");
  tft.drawString(buff,0,100);
  float T=0.9,H=-0.9;
  int pos=0;
  while(1){
      for(int i =0;i<50;i++){
        if (mySensor.accelUpdate() == 0) {
          aX+=mySensor.accelX();
          aY+=mySensor.accelY();
          aZ+=mySensor.accelZ();
        }
      }
      aX/=50;
      aY/=50;
      aZ/=50;
      
      if(abs(aX)>abs(aY)&&abs(aX)>abs(aZ)){
       //X方向
       snprintf(buff,sizeof(buff),"START Calibration ACC-X");
       tft.drawString(buff,0,60);
       pos=0;
      }else if(abs(aY)>abs(aX)&&abs(aY)>abs(aZ)){
       //Y方向
       snprintf(buff,sizeof(buff),"START Calibration ACC-Y");
       tft.drawString(buff,0,80);
       pos=1;
      }else if(abs(aZ)>abs(aY)&&abs(aZ)>abs(aX)){
       //Z方向
       snprintf(buff,sizeof(buff),"START Calibration ACC-Z");
       tft.drawString(buff,0,100);
       pos=2;
      }
      float ab[3]={0,0,0};
       for(int i=0;i<ndata;i++){
         //校正開始
         if (mySensor.accelUpdate() == 0) {
           ab[0]+=(mySensor.accelX()/S[0])+Ab[0];
           ab[1]+=(mySensor.accelY()/S[1])+Ab[0];
           ab[2]+=(mySensor.accelZ()/S[2])+Ab[0];
         }
         //若突然換方向要及時發現並重新轉到那個方向校正

       }
       Ab[0]=ab[0]/ndata;
       Ab[1]=ab[1]/ndata;
       Ab[2]=ab[2]/ndata;
       if (mySensor.accelUpdate() == 0) {
         S[2]=G/Ab[2];
         aZ=S[2]*(mySensor.accelZ()- Ab[2])+G;
       }
       Serial.println("=-------------=");
       if (aZ-G<0.02){
        break;
       }
  }
  
  
  delay(1000);
  tft.fillScreen((0x0000));
  tft.setTextSize(1);
  tft.setTextColor(TFT_WHITE, TFT_BLACK); 
  
}

void enterDeepSleep(){
  #define ST7735_DISPOFF 0x28
  #define ST7735_DISPON 0x29
  #define ST7735_SLPIN 0x10
  tft.writecommand(ST7735_DISPOFF);
  tft.writecommand(ST7735_SLPIN);
  esp_sleep_enable_ext1_wakeup(GPIO_SEL_0,ESP_EXT1_WAKEUP_ALL_LOW);
  esp_deep_sleep_start(); 
}


void loop() {
  // read the sensor
  // display the data
    button.tick();
    uint8_t sensorId;
    if (mySensor.readId(&sensorId) == 0) {
//      Serial.println("sensorId: " + String(sensorId));
    } else {
      Serial.println("Cannot read sensorId");
    }
  
    if (mySensor.accelUpdate() == 0) {
      aX = mySensor.accelX();
      aY = mySensor.accelY();
      aZ = mySensor.accelZ();
      aZ=S[2]*(mySensor.accelZ()- Ab[2])+G+0.02;
      aSqrt = mySensor.accelSqrt();
//      Serial.println("accelX: " + String(aX));
//      Serial.println("accelY: " + String(aY));
//      Serial.println("accelZ: " + String(aZ));
//      Serial.println("accelSqrt: " + String(aSqrt));

//      Serial.print(G*aX);
//      Serial.print(",");
//      Serial.print(G*aY);
//      Serial.print(",");
//      Serial.print(G*aZ);
//      Serial.print(",");
      snprintf(buff,sizeof(buff),"ax : %.3f  ",G*aX);
      tft.drawString(buff,0,0);
      snprintf(buff,sizeof(buff),"ay : %.3f  ",G*aY);
      tft.drawString(buff,0,60);
      snprintf(buff,sizeof(buff),"az : %.3f  ",G*aZ);
      tft.drawString(buff,0,100);
    } else {
      Serial.println("Cannod read accel values");
      snprintf(buff,sizeof(buff),"ax : nan");
      tft.drawString(buff,0,0);
      snprintf(buff,sizeof(buff),"ay : nan");
      tft.drawString(buff,0,60);
      snprintf(buff,sizeof(buff),"az : nan");
      tft.drawString(buff,0,100);
    }
  
    if (mySensor.gyroUpdate() == 0) {
      gX = mySensor.gyroX();
      gY = mySensor.gyroY();
      gZ = mySensor.gyroZ();
      gX-=Gb[0];
      gY-=Gb[1];
      gZ-=Gb[2];
//      Serial.println("gyroX: " + String(gX));
//      Serial.println("gyroY: " + String(gY));
//      Serial.println("gyroZ: " + String(gZ));
      Serial.print(gX);
      Serial.print(",");
      Serial.print(gY);
      Serial.print(",");
      Serial.print(gZ);
      snprintf(buff,sizeof(buff),"gx : %.3f       ",gX);
      tft.drawString(buff,120,0);
      snprintf(buff,sizeof(buff),"gy : %.3f       ",gY);
      tft.drawString(buff,120,60);
      snprintf(buff,sizeof(buff),"gz : %.3f       ",gZ);
      tft.drawString(buff,120,100);
    } else {
      Serial.println("Cannot read gyro values");
      snprintf(buff,sizeof(buff),"gx : nan",gX);
      tft.drawString(buff,120,0);
      snprintf(buff,sizeof(buff),"gy : nan",gY);
      tft.drawString(buff,120,60);
      snprintf(buff,sizeof(buff),"gz : nan",gZ);
      tft.drawString(buff,120,100);
    }
    Serial.println();
    delay(70);
}
