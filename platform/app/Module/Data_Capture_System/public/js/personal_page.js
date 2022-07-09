let ws = null;
window.addEventListener("DOMContentLoaded", async (event) => {
    let data = await (await fetch("/app/api/v1/users")).json();
    if (data.error) {
        return alert("Error: " + data.meesage);
    }
    data = { "data": [{ "username": pid_, "height": "120", "weight": "120", "age": "943", "bed": "0", "device": "device_A", "state": "1", "gender": "dickhead", "op_code": "0" }] }
    rtd_initialization(data.data)
    ws = new RTDSocket({ onmessage: RTDSocketMessage });

    //Analysis dashboard: use history data + 
    // AI result
    // external value percentage

    // navigator.serviceWorker.register('/dcs/sw.js').then(function (registration) {
    //     // console.log('ServiceWorker registration successful with scope: ', registration.active);
    //     // let dropdown = document.querySelector("#dropdown-menu");
    //     // if( dropdown )
    //     //   createElement( { 
    //     //     el:"span", className:"dropdown-item", 
    //     //     innerText:"Update Service worker", 
    //     //     onclick: () => {
    //     //       registration.update().then( (res) => {
    //     //         console.log( res );
    //     //       } );
    //     //     }
    //     //   }).then( ( el ) => dropdown.appendChild( el ) );
    //     registration.update();
    // });
    isWebBluetoothEnabled()
});

//Web BLE



async function onStartButtonClick() {
    connect2BLEServer(0xfff0, 0xfff1, lifecare_10_handler)
}

async function onStartButtonClickTEMP() {
    connect2BLEServer(0xC050, 0xC05A, temp_pal_handler)
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

function lifecare_10_handler(event) {
    let value = event.target.value;
    // let a = [];
    // Convert raw data bytes to hex values just for the sake of showing something.
    // In the "real" world, you'd use data.getUint8, data.getUint16 or even
    // TextDecoder to process raw data bytes.
    // 
    // for (let i = 0; i < value.byteLength; i++) {
    //     a.push(value.getUint8(i).toString());
    // }
    // // log('> ' + a.join(' '));
    // console.log(a)
    if (value.getUint8(2).toString() == 83) {
        var HR = value.getUint8(6).toString(), SPO2 = value.getUint8(5).toString()
        let data = {
            "topic": "irb",
            "data": {
                topic: `Lifecare10/${pid_}`, 
                "data": {
                    "spo2_HeartRate": {
                        "HeartRate": HR,
                        "time": Number(new Date()),
                        "Spo2": SPO2
                    },
                }
            }
        }
        console.log( '[Data][HEART]', { HeartRate: HR, Spo2: SPO2} );
        
        ws.send(data);
    } else if (value.getUint8(2).toString() == 67) {
        var DBP = value.getUint8(8).toString(), SBP = value.getUint8(6).toString(), MAP = parseInt((parseInt(SBP) - parseInt(DBP)) / 3 + parseInt(DBP)), PR = value.getUint8(9).toString()
        let data = {
            "topic": "irb",
            "data": {
                topic: `Lifecare10/${pid_}`, 
                "data": {
                    "NiBP": {
                        "DBP": DBP,
                        "SBP": SBP,
                        "time": Number(new Date()),
                        // "error":200,
                        "MAP": MAP
                    }
                }
            }
        }
        
        ws.send(data);
    } else if (value.getUint8(2).toString() == 82) {
        var ppg1 = value.getUint8(5).toString()
        var ppg2 = value.getUint8(6).toString()
        if (parseInt(ppg1) - parseInt(ppg2) > 10) {
            ppg1 = ppg2
        } else if (parseInt(ppg2) - parseInt(ppg1) > 10) {
            ppg2 = ppg1
        }
        let data = {
            "topic": "irb",
            "data": {
                topic: `Lifecare10/${pid_}`, 
                "data": {
                    "waveform": [{
                        "time": Number(new Date()),
                        "wavePoint": ppg1
                    }]
                }
            }
        }
        
        ws.send(data);
    } else if (value.getUint8(2).toString() == 66) {
        var bp = value.getUint8(6).toString();
    }
}

function temp_pal_handler(event) {
    let value = event.target.value;
    let temp = ((value.getUint8(2) * 256 + value.getUint8(3)) / 100).toString()
    // console.log(temp)
    let data = {
        "topic": "irb",
        "data": {
            topic: "Lifecare10/" + pid_,
            "data": {
                "Temperature": {
                    "Temperature": temp,
                    "time": Number(new Date()),
                }
            }
        }
    }
    
    ws.send(data);
}