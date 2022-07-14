// const { objectBag } = require("@svgdotjs/svg.js");

let ws = null;
window.addEventListener("DOMContentLoaded", async (event) => {
    isWebBluetoothEnabled()
});

//Web BLE
async function connectimu(obj) {
    obj.connect()
}

function seal_ring_imu_handler(event) {
    let value = event.target.value;
    let a = [];
    let imu = [];
    // console.log(value.byteLength);
    const name = ["ax", "ay", "az", "gx", "gy", "gz"];
    for (let i = 1; i <= value.byteLength; i++) {
        a.push(value.getUint8(i - 1).toString());
        if (i % 4 == 0) {
            let sign = 1
            if (a[0] == "1") sign = -1
            let data = sign * (parseInt(a[3]) * 256 + parseInt(a[2]))
            // console.log(a)
            if (name[i / 4 - 1] == "gx" || name[i / 4 - 1] == "gy" || name[i / 4 - 1] == "gz") {
                data = data / 100
            } else {
                data = data / 1000
            }
            imu.push(data)
            a = []
        }
    }
    console.log("imu:", event, imu)

    // obj.Chart(imu);
}



async function onStartButtonClickSRimu() {
    connect2BLEServer(0xA050, 0xA001, seal_ring_imu_handler)
}

async function onStartButtonClickSRtemp() {
    connect2BLEServer(0xA050, 0xA05a, seal_ring_temp_handler)
}

async function onStartButtonClickSRppg() {
    connect2BLEServer(0xA050, 0xA002, seal_ring_ppg_handler)
}


function seal_ring_ppg_handler(event) {
    let value = event.target.value;
    let ir = parseInt(value.getUint8(1).toString()) * 256 + parseInt(value.getUint8(0).toString())
    let red = parseInt(value.getUint8(3).toString()) * 256 + parseInt(value.getUint8(2).toString())
    console.log("irppg:", ir, " redppg:", red)
}
function seal_ring_temp_handler(event) {
    let value = event.target.value;

    let temp = (parseInt(value.getUint8(0).toString()) * 256 + parseInt(value.getUint8(1).toString())) / 100
    // let a = [];
    // for (let i = 0; i < value.byteLength; i++) {
    //     a.push(value.getUint8(i).toString());
    // }
    // log('> ' + a.join(' '));
    console.log("temp:", temp)
}

function seal_ring_bat_handler(event) {
    let value = event.target.value;
    let a = [];

    for (let i = 0; i < value.byteLength; i++) {
        a.push(value.getUint8(i).toString());
    }
    // log('> ' + a.join(' '));
    console.log("bat:", a)
}

function seal_ring_imu_handler(event) {
    let value = event.target.value;
    let a = [];
    let imu = [];
    // console.log(value.byteLength);
    const name = ["ax", "ay", "az", "gx", "gy", "gz"];
    for (let i = 1; i <= value.byteLength; i++) {
        a.push(value.getUint8(i - 1).toString());
        if (i % 4 == 0) {
            let sign = 1
            if (a[0] == "1") sign = -1
            let data = sign * (parseInt(a[3]) * 256 + parseInt(a[2]))
            // console.log(a)
            if (name[i / 4 - 1] == "gx" || name[i / 4 - 1] == "gy" || name[i / 4 - 1] == "gz") {
                data = data / 100
            } else {
                data = data / 1000
            }
            imu.push(data)
            a = []
        }
    }
    console.log("imu:", imu)
}