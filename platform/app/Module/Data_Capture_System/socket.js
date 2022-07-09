const DEBUG = require("debug")("socket");


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
    // console.log( '[Socket]',data );
    switch (data.topic) {
      case "irb":
        console.log(data);
        ws_publish(data.topic, data.data);
        writeIRBData(data.data);
        break;
      case "refresh": ws_publish("refresh", data.data); break;
      default: DEBUG("[Socket] Unknown message", data);
    }
  } catch (e) {
    console.log("[Socket] Error", e);
  }
}

function ws_publish(topic, data) { // not a good solution
  websocket_server.CLIENTS.forEach((w) => {
    w.send(JSON.stringify({ topic, data }));
  });
}

async function writeIRBData(parame) {
  let { topic, data } = parame;
  let pid = topic.replace(/Lifecare10\/(\S+)/, "$1");

  let { spo2_HeartRate, waveform, BP, Temperature } = data;
  // console.log( data );
  await writeHeartData({ pid, data: spo2_HeartRate });
  await writePPGData({ pid, data: waveform });
  await writeBPData({ pid, data: BP });
  await writeTemperatureData({ pid, data: Temperature });
}

async function writeHeartData(heart_data) {
  let { data } = heart_data;
  if (heart_data.data === undefined)
    return false;
  let heartSQL = `INSERT INTO dcs_HEART (pid, hr, spo2, date) VALUES (?, ?, ?, ?)`;
  let heartData = [heart_data.pid, data.HeartRate, data.Spo2, UNIX2TIMESTAMP(data.time)];
  let res = await HEART.query(heartSQL, heartData);
  return res;
}

async function writePPGData(ppg_data) {
  if (ppg_data.data === undefined)
    return false;
  let ppgSQL = `INSERT INTO dcs_PPG ( pid, value, date ) VALUES ${ppg_data.data.map(v => '(?,?,?)').join(",")}`;
  let ppgData = [];
  for (let i = 0; i < ppg_data.data.length; i++) {
    let ppg = ppg_data.data[i];
    ppgData.push(ppg_data.pid);
    ppgData.push(ppg.wavePoint);
    ppgData.push(UNIX2TIMESTAMP(ppg.time));
  }
  let res = await PPG.query(ppgSQL, ppgData);
  return res;
}

async function writeBPData(bp_data) {
  let { data } = bp_data;
  if (bp_data.data === undefined)
    return false;
  let bpSQL = `INSERT INTO dcs_BP ( pid, dbp, sbp, map, date ) VALUES (?, ?, ?, ?, ?)`;
  let bpData = [bp_data.pid, data.DBP, data.SBP, data.MAP, UNIX2TIMESTAMP(data.time)];
  let res = await BP.query(bpSQL, bpData);
  return res;
}

async function writeTemperatureData(temp_data) {
  let { data } = temp_data;
  if (data === undefined)
    return false;
  let tempSQL = `INSERT INTO dcs_Temperature ( pid, temp, date ) VALUES (?, ?, ?)`;
  let tempData = [temp_data.pid, data.Temperature, UNIX2TIMESTAMP(data.time)];
  let res = await Temperature.query(tempSQL, tempData);
  return res;
}

function UNIX2TIMESTAMP(unix) {
  return (new Date(unix)).toISOString().replace(/[A-Z]/g, ' ').substring(0, 19);
}


exports.connection = connection;