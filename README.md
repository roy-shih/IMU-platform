# IMU-platform
This platform integrates one or more IMU terminal devices and analyzes the IMU data through analysis algorithms to achieve the purpose of gait estimation and trajectory tracking.
<br>
<br>
The architecture of the platform is divided into the front end, back end, and sensor end. Front-end functions include various functional interfaces such as device status monitor, device grouping interface, and data analysis result chart. For users (such as physicians) to easily adjust the grouping status of the sensors and observe the real-time analysis results of the subjects.
<br>
<br>
Back-end functions include IMU 9-axis data library, sensor information, UUID generator, gait analysis algorithm, trajectory analysis, and trajectory drawing algorithm, WebSocket, and various APIs. As the front-end and sensor-side functional connection and real-time update of pictures or parameters.
<br>
<br>
Sensor side functions include data capture system, calibration algorithm, SPIFFS, Wifi manager system, POST/GET method, WebSocket client, and other functional modules on the sensor side. Through a special topology network, you can freely adjust different numbers of sensor groups.
