let ws = new WebSocket('ws://' + window.location.hostname + ':3000/ws/imu')

//開啟後執行的動作，指定一個 function 會在連結 WebSocket 後執行
ws.onopen = () => {
    console.log('open connection')
}
ws.onmessage = (msg) => {
    msg = JSON.parse(msg.data);

    if (msg.type == 'control') {
        // console.log(msg)
        state = msg.state
        document.getElementById("button1").innerHTML = msg.state
        document.getElementById("device_left_name").value = msg.device_left
        document.getElementById("device_right_name").value = msg.device_right
        device_right = msg.device_right
        device_left = msg.device_left
        if (state === "Start") {
            document.getElementById("device_left_name").setAttribute("disabled", "disabled");
            document.getElementById("device_right_name").setAttribute("disabled", "disabled");
            document.getElementById("right_data").innerHTML = "";
            document.getElementById("left_data").innerHTML = "";
        } else {

            document.getElementById("device_left_name").removeAttribute("disabled");
            document.getElementById("device_right_name").removeAttribute("disabled");
        }
    } else if (msg.type == 'data_render') {
        if (msg.device == device_right) {
            document.getElementById("right_data").innerHTML = msg.data;
        } else if (msg.device == device_left) {
            document.getElementById("left_data").innerHTML = msg.data;
        }
        render_data()
    }


}

//關閉後執行的動作，指定一個 function 會在連結中斷後執行
ws.onclose = () => {
    console.log('close connection')
}

var state = "Stop"
var device_right = ""
var device_left = ""

function select1() {
    device_left = document.getElementById("device_left_name").value;
}

function select2() {
    device_right = document.getElementById("device_right_name").value;
}

function controlIMU() {
    if (device_right == '' || device_left == '') {
        alert("選擇IMU");
    }
    if (device_right == device_left) {
        alert("重複選擇IMU");
    } else {
        if (state == "Start") {
            state = "Stop"
            document.getElementById("device_left_name").removeAttribute("disabled");
            document.getElementById("device_right_name").removeAttribute("disabled");
            document.getElementById('button1').style.backgroundColor = "#405555";
        } else {
            state = "Start"
            document.getElementById("device_left_name").setAttribute("disabled", "disabled");
            document.getElementById("device_right_name").setAttribute("disabled", "disabled");

            document.getElementById('button1').style.backgroundColor = "#0f8b8d";
        }
        var data = {
            type: "control",
            "state": state,
            "device_right": device_right,
            "device_left": device_left,
        }
        ws.send(JSON.stringify(data))
    }
}

function downloadFile(data, fileName) {
    var csvData = data;
    var blob = new Blob(["\ufeff" + csvData], {
        type: "application/csv;charset=utf-8;"
    });

    if (window.navigator.msSaveBlob) {
        // FOR IE BROWSER
        navigator.msSaveBlob(blob, fileName);
    } else {
        // FOR OTHER BROWSERS
        var link = document.createElement("a");
        var csvUrl = URL.createObjectURL(blob);
        link.href = csvUrl;
        link.style = "visibility:hidden";
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function downloadleft() {
    if (document.getElementById('pid').value == "") {
        alert("受試者編號為空")
    } else {
        file_name = "l" + document.getElementById('pid').value + ".csv"
        str = "Time (s),Gyroscope X (deg/s),Gyroscope Y (deg/s),Gyroscope Z (deg/s),Accelerometer X (g),Accelerometer Y (g),Accelerometer Z (g)\n" + document.getElementById("left_data").innerHTML
        downloadFile(str, file_name);
        file_name = "r" + document.getElementById('pid').value + ".csv"
        str = "Time (s),Gyroscope X (deg/s),Gyroscope Y (deg/s),Gyroscope Z (deg/s),Accelerometer X (g),Accelerometer Y (g),Accelerometer Z (g)\n" + document.getElementById("right_data").innerHTML
        downloadFile(str, file_name);
    }

}