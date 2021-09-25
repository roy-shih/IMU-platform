# Frontend system design
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
# Backend system design
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

