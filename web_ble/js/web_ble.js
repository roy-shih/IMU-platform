
const data = {
    // labels: labels,
    datasets: [{
        label: 'Ax',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [],
    }, {
        label: 'Ay',
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgb(54, 162, 235)',
        data: [],
    }, {
        label: 'Az',
        backgroundColor: 'rgb(255, 205, 86)',
        borderColor: 'rgb(255, 205, 86)',
        data: [],
    }, {
        label: 'gx',
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgb(75, 192, 192)',
        data: [],

    }, {
        label: 'gy',
        backgroundColor: 'rgb(153, 102, 255)',
        borderColor: 'rgb(153, 102, 255)',
        data: [],
    }, {
        label: 'gz',
        backgroundColor: 'rgb(255, 159, 64)',
        borderColor: 'rgb(255, 159, 64)',
        data: [],
    }]
};

const config = {
    type: 'line',
    data: data,
    options: {
        scales: {
            x: {
                type: 'realtime',
                //   realtime:{
                //       onRefresh: function(chart){
                //           chart.data.labels.push(luxon.DateTime.local().toFormat('HH:mm:ss'));
                //           chart.data.datasets.forEach(function(dataset){
                //               dataset.data.push(Math.random() * 100);
                //           });
                //           chart.update();
                //       }
                //   }
            },
            y: {
                min: 0,
                max: 100
            }
        }
    }
};
function isWebBluetoothEnabled() {
    if (!navigator.bluetooth) {
        console.log('Web Bluetooth API is not available in this browser!')
        cuteToast({
            type: 'error',
            title: "Web BLE error",
            message: 'Web BLE API is not available',
            img: "img/error.svg",
            timer: 3000
        });
        return false
    }
    console.log('Web Bluetooth API is available in this browser!')
    cuteToast({
        type: 'success',
        title: "Web BLE",
        message: 'Web BLE API is available',
        img: "img/success.svg",
        timer: 3000
    });
    return true
}



function ble_device(name, serviceUuid, characteristicUuid, myChart, handler) {
    this.name = name;
    this.serviceUuid = serviceUuid;
    this.characteristicUuid = characteristicUuid;
    this.handler = handler;
    this.myCharacteristic = new Object();
    this.myChart = new Chart(
        document.getElementById(myChart),
        config
    );;
}
ble_device.prototype.connect = async function () {
    try {
        console.log('Requesting Bluetooth Device...');
        const device = await navigator.bluetooth.requestDevice({
            filters: [{
                services: [this.serviceUuid]
            }]
        });
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(this.serviceUuid);
        this.myCharacteristic = await service.getCharacteristic(this.characteristicUuid);
        await this.myCharacteristic.startNotifications();
        this.myCharacteristic.addEventListener('characteristicvaluechanged', this.handler)
    } catch (error) {
        console.log('Argh! ' + error);
    }
}
ble_device.prototype.disconnect = async function () {
    try {
        await this.myCharacteristic.stopNotifications();
        await this.myCharacteristic.removeEventListener('characteristicvaluechanged', this.handler);
        await this.myCharacteristic.disconnect();
    } catch (error) {
        console.log('Argh! ' + error);
    }
}
ble_device.prototype.commond = function (value) {
    let encoder = new TextEncoder('utf-8');
    this.myCharacteristic.writeValue(encoder.encode(value));
    console.log("commond:", value)
};

ble_device.prototype.Chart = function (value) {
    console.log(value)
    // this.myChart.data.labels.push(luxon.DateTime.local().toFormat('HH:mm:ss'));
    // this.myChart.data.datasets.forEach(function (dataset) {
    //     dataset.data.push(value);
    // });
    // this.myChart.update();
}


// async function connect2BLEServer(serviceUuid, characteristicUuid, handler) {
//     var myCharacteristic;
//     try {
//         console.log('Requesting Bluetooth Device...');
//         const device = await navigator.bluetooth.requestDevice({
//             filters: [{
//                 services: [serviceUuid]
//             }]
//         });
//         // log('Connecting to GATT Server...');
//         const server = await device.gatt.connect();
//         // log('Getting Service...');
//         const service = await server.getPrimaryService(serviceUuid);
//         // log('Getting Characteristic...');
//         myCharacteristic = await service.getCharacteristic(characteristicUuid);
//         // Writing 1 is the signal to reset energy expended.
//         await myCharacteristic.startNotifications();
//         // log('> Notifications started');
//         myCharacteristic.addEventListener('characteristicvaluechanged', handler);
//         // log('> Waiting for value changes...');
//         //write
//         function commond(value) {
//             myCharacteristic.writeValue(value);
//         }
//         // log('> Value written');

//     } catch (error) {
//         console.log('Argh! ' + error);
//     }
// }