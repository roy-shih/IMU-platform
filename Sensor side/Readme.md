# Sensor group design
1. Subsystem design: Grafcet
        <br><img width="661" alt="截圖 2021-09-27 上午3 30 34" src="https://user-images.githubusercontent.com/79713835/134821572-f6c41fff-18aa-4a29-9d07-76393c6bd3b7.png">

2. System Module To-do
    - [x]  FreeRTOS
    - [x]  Wifimanager
    - [x]  Sensor built-in calibration algorithm
    - [x]  SPIFFS(SPI Flash File System)
    - [x]  POST function
    - [x]  GET function
    - [ ]  Websocket function
    - [ ]  X5 Data capture：實時檢測訊號品質（太差要重新校正）
    - [ ]  X6 POST Data to DB & clean memory： Group leader 收集完Group member的資料後，對齊後 POST 到 DB
4. Hardware To-do
    - [ ]  顯示網路連接、是否加入群組等狀態：RGB LED
    - [ ]  顯示群組：RGB LED、tiny OLED screen

# System time diagram
![image](https://user-images.githubusercontent.com/79713835/134807612-a4871dc7-acc6-4ed8-a8de-0ee5924df51f.png) 
