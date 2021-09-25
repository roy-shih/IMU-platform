# IMU-platform
1. Sensor group design
    1. Subsystem design: Grafcet

        ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e5192fd6-1043-4ea8-b847-5d503d8aeecd/Untitled.png)

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
    3. Hardware To-do
        - [ ]  顯示網路連接、是否加入群組等狀態：RGB LED
        - [ ]  顯示群組：RGB LED、tiny OLED screen
2. Frontend system design
    1. Sensor Group設定
        1. 已設定區
            1. UUID（群組名）
            2. 設備號
            3. 位置
            4. Leader IP
            5. 設置介面
                1. 調整位置
                2. 離開群組
        2. 未設定區
            1. 加入群組（下拉式群組列表）
    2. 顯示分析畫面
3. Backend system design
    1. 系統
        1. data models
            1. Device
                1. Device ID： Char
                2. Group UUID： Char
                3. Position： Selection
                4. Leader IP： Char
            2. Data
                1. Raw data： Char
                2. gait： float
                3. Trajectory graph： png
        2. API
            1. POST: receive data from the sensor group leader
            2. GET: Return the device info to the requester.
        3.  Frontend Render
            1. 步態分析
            2. 軌跡圖
    2. 開發者
        1. 自定義設備號
        2. 初始化設備參數
            1. 是否固定位置
            2. 固定在哪裡
        3. 客製化 API ＆ Frontend Render (待商榷)
