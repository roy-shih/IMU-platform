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



function ble_device(name, serviceUuid, characteristicUuid, writeCharacteristic, handler) {
    this.name = name;
    this.serviceUuid = serviceUuid;
    this.characteristicUuid = characteristicUuid;
    this.writeCharacteristic = writeCharacteristic;
    this.handler = handler;
    this.myCharacteristic = new Object();
    this.mywriteCharacteristic = new Object();
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
        if (this.writeCharacteristic != null) {
            this.mywriteCharacteristic = await service.getCharacteristic(this.writeCharacteristic);
        }
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
    let encoder = new Uint8Array(value);
    try {
        this.mywriteCharacteristic.writeValue(encoder);
        return true
    } catch (error) {

        console.log('Argh! ' + error);
        return false
    }

    // console.log("commond:", encoder)
};

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
//     } catch (error) {
//         console.log('Argh! ' + error);
//     }
// }