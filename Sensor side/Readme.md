# Sensor group design
1. Subsystem design: Grafcet
        <br><img width="649" alt="截圖 2021-09-25 下午10 52 29" src="https://user-images.githubusercontent.com/79713835/134775714-e222b4dc-8960-4bc2-bfbd-4b2f3beb7913.png">

2. System Module To-do
    - [ ]  FreeRTOS
    - [ ]  Wifimanager
    - [ ]  Sensor built-in calibration algorithm
    - [ ]  SPIFFS(SPI Flash File System)
    - [ ]  POST function
    - [ ]  GET function
    - [ ]  Websocket function
    - [ ]  X5 Data capture：實時檢測訊號品質（太差要重新校正）
    - [ ]  X6 POST Data to DB & clean memory： Group leader 收集完Group member的資料後，對齊後 POST 到 DB
4. Hardware To-do
    - [ ]  顯示網路連接、是否加入群組等狀態：RGB LED
    - [ ]  顯示群組：RGB LED、tiny OLED screen
