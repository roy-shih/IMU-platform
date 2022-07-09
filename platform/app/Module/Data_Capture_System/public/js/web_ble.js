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


async function connect2BLEServer(serviceUuid, characteristicUuid, handler) {
    var myCharacteristic;
    try {
        console.log('Requesting Bluetooth Device...');
        const device = await navigator.bluetooth.requestDevice({
            filters: [{
                services: [serviceUuid]
            }]
        });
        // log('Connecting to GATT Server...');
        const server = await device.gatt.connect();
        // log('Getting Service...');
        const service = await server.getPrimaryService(serviceUuid);
        // log('Getting Characteristic...');
        myCharacteristic = await service.getCharacteristic(characteristicUuid);
        // Writing 1 is the signal to reset energy expended.
        await myCharacteristic.startNotifications();
        // log('> Notifications started');
        myCharacteristic.addEventListener('characteristicvaluechanged', handler);
    } catch (error) {
        console.log('Argh! ' + error);
    }
}