# System Architure

<br><img width="617" alt="截圖 2021-09-25 下午11 13 42" src="https://user-images.githubusercontent.com/79713835/134776388-afe5ad38-1eae-4189-8909-0291174b4d0a.png">


# Frontend system design
1. Sensor Group設定
   1. Wireframe
      <br><img width="416" alt="截圖 2021-09-25 下午11 24 48" src="https://user-images.githubusercontent.com/79713835/134776714-6da5ebe2-221e-44a8-b6fc-7edf1c41d5b8.png">
   2. 已設定區

      1. UUID（群組名）
      2. 設備號
      3. 位置
      4. Leader IP
      5. 設置介面
         1. 調整位置
         2. 離開群組
   3. 未設定區
      1. 加入群組（下拉式群組列表）
2. 顯示分析畫面
# Backend system design
1. 系統
    1. data models
       <img width="1440" alt="截圖 2021-09-26 下午7 52 24" src="https://user-images.githubusercontent.com/79713835/134806577-2112ebca-f9f0-43a3-9de4-d6bd4cccc5d4.png">
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
           <img width="1440" alt="截圖 2021-09-27 上午12 00 21" src="https://user-images.githubusercontent.com/79713835/134815245-b75e8bfc-a956-4c25-8845-42227e2dfe54.png">
        3. GET: Return the device info to the requester.
           <img width="1438" alt="截圖 2021-09-26 下午7 51 59" src="https://user-images.githubusercontent.com/79713835/134806537-5469b7cc-15a9-4fbd-a9c6-28516e7324b6.png">
    3.  Frontend Render
        1. 步態分析
        2. 軌跡圖
2. 開發者
    1. 自定義設備號
    2. 初始化設備參數
        1. 是否固定位置
        2. 固定在哪裡
    3. 客製化 API ＆ Frontend Render (待商榷)

