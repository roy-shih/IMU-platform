const DEBUG = require("debug")("socket");
const mqtt = require('mqtt');
const mqtt_client = mqtt.connect("mqtt://bioweb.dmc.nycu.edu.tw");

const { HEART, BP, PPG, Temperature, Resp } = require("./control");

var websocket_server = {
  CLIENTS: new Array(),
};

async function connection(w) {
  console.log("[Socket] New client");
  websocket_server.CLIENTS.push(w);
  w.on('message', wsOnMessage);
}

async function wsOnMessage(message) {
  try {
    let data = JSON.parse(message);
    console.log('[Socket]', data);
    // switch (data.topic) {
    //   case "irb":
    //     ws_publish(data.topic, data.data);
    //     if (data.demo != true)
    //       writeIRBData(data.data);
    //     break;
    //   case "ai":
    //     ws_publish(data.topic, data.data);
    //     break;
    //   case "refresh": ws_publish("refresh", data.data); break;
    //   default: DEBUG("[Socket] Unknown message", data);
    // }
  } catch (e) {
    console.log("[Socket] Error", e);
  }
}

// function ws_publish(topic, data) { // not a good solution
//   websocket_server.CLIENTS.forEach((w) => {
//     w.send(JSON.stringify({ topic, data }));
//   });
// }




exports.connection = connection;