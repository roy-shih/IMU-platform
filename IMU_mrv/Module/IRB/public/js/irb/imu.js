var colors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 99, 132, 1)'
];
var url = window.location.hostname;
var ws = new WebSocket('ws://' + url + ':3000/ws/imu');
ws.open = function() {
    console.log('connected');
}
ws.onmessage = function(msg) {
    var data = JSON.parse(msg.data);
    // console.log(data)
    updateValue(data)
}
ws.close = function() {
    console.log('disconnected');
}
var num = 0
console.log(Info('left_device_id'))

function updateValue(data) {
    if (data.type == 'data') {

        if (data.ID === Info('left_device_id')) {
            if (typeof(data.data.G) != 'undefined') {
                changechart(leftChart, "Gx", num, data.data.G.X)
                changechart(leftChart, "Gy", num, data.data.G.Y)
                changechart(leftChart, "Gz", num, data.data.G.Z)
            }
            if (typeof(data.data.A) != 'undefined') {
                changechart(leftChart, "Ax", num, data.data.A.X)
                changechart(leftChart, "Ay", num, data.data.A.Y)
                changechart(leftChart, "Az", num, data.data.A.Z)
            }
        }
        num++

        // if (data.ID == Info('right').id) {
        //     if (typeof(data.G) != 'undefined') {
        //         changechart(rightChart, "Gx", data.Time, data.G.X)
        //         changechart(rightChart, "Gy", data.Time, data.G.Y)
        //         changechart(rightChart, "Gz", data.Time, data.G.Z)
        //     }
        //     if (typeof(data.A) != 'undefined') {
        //         changechart(rightChart, "Ax", data.Time, data.G.X)
        //         changechart(rightChart, "Ay", data.Time, data.A.X)
        //         changechart(rightChart, "Ax", data.Time, data.M.X)
        //     }
        // }
    }
}

function changechart(chart, type, x, y) {

    for (var i = 0; i < chart.data.datasets.length; i++) {
        if (chart.data.datasets[i].label == type) {
            if (chart.data.datasets[i].data.length >= 500) {
                chart.data.datasets[i].data.shift()
            }
            vector = {
                x: x,
                y: y
            }
            chart.data.datasets[i].data.push(vector)
            chart.update()
        }
    }
}

function Info(ID) {
    var e = document.getElementById(ID);
    return e.value;
}

function ALL(command) {
    var data = {
        type: "command",
        left: Info('left_device_id'),
        right: Info('right_device_id'),
        command: command
    }
    ws.send(JSON.stringify(data))
}