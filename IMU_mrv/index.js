// const fs = require("fs");
const express = require("express")
    // const path = require('path');
    // const bodyParser = require('body-parser');

/////////////////////// Controller ///////////////////////
let IP = "";
const Port = 8000
const expressServer = express()


//定義 app module Routing rule
expressServer.use("/", require("./Module/IRB/route"));

// 定義 app module UI
expressServer.set("views", [`${__dirname}/views`, `${__dirname}/Module/IRB/views`]);



//Asgi
//Websocket server
const ws = require("ws");
const websocket_server = require("./websocket_server.js")

const wsServer = new ws.Server({
    server: expressServer.listen(3000),
    host: IP,
    path: "/ws/irb"
})

wsServer.on("connection", async(w) => {
    //connect initial
    websocket_server.CLIENTS.push(w)
    w.on("message", (msg) => {
        msg = msg.toString()
        console.log(msg)
            // var data = JSON.parse(msg);
        var res = { message: 'OK' }
        websocket_server.sendAll(JSON.stringify(res))
    })
    w.on('close', () => {
        console.log('BOT disconnected')
    })
})



function getIPAdress() {
    var IP;
    let interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                IP = alias.address
                return IP;
            }
        }
    }
}

expressServer.listen(Port, IP, () => {
    console.log(`server is running at http://${getIPAdress()}:${Port}`)
})