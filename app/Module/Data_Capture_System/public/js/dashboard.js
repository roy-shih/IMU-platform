var apps = [];
//Real-Time Dashboard: RTD
function RTDSocketMessage(message) {
    try {
        // console.log(message);
        let msg = JSON.parse(message.data);
        // console.log('[msg]', msg);
        switch (msg.topic) {
            // case "bed": rtd_initialization( msg.data ); break;
            case "irb": rtd_data_update(msg.data); break;
            case "ai": rtd_ai_detection(msg.data); break;
            case "refresh": location.reload(); break; // another security issues
            default: console.log("[Socket] Unknown topic:", msg.topic, msg);
        }
    } catch (error) {
        console.log("[Error] Invalid message format");
        console.log(error);
        console.log(message);
    }
}

function RTDSocket(config) {
    let ws = null;
    let closeByUser = false;


    if (typeof config !== "object") {
        config = new Object();
    }

    var openEvent = config.onopen || function openEvent(e) {
        console.log("[Socket] connection is ready");
    }

    var closeEvent = config.onclose || function closeEvent(e) {
        if (closeByUser) {
            ws = null;
            return;
        }

        // reconnect, also mean create a new connection.
        console.log("Service is disconnected");
        setTimeout(initializ, 3000);
    }

    var errorEvent = config.onerror || function errorEvent(e) {

    }

    var messageEvent = config.onmessage || function messageEvent(e) {

    }

    this.send = function (message) {
        if (ws) {
            if (typeof message === "object")
                message = JSON.stringify(message);
            ws.send(message);
        }
    }

    function initializ() {
        try {
            ws = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/dcs/ws`);

            // Old man coding style
            ws.onopen = openEvent;
            ws.onclose = closeEvent;
            ws.onerror = errorEvent;
            ws.onmessage = messageEvent;
        } catch (error) {
            // Connection failed or other error
        }
    }

    initializ();
}

function rtd_initialization(patients) {
    for (let key in apps) {
        let app = apps[key];
        app.container.remove();
    }
    apps = new Object();

    for (let p of patients) {
        apps[p.username] = (new application({
            root: document.querySelector("#service"),
            profile: [
                { order: 0, name: "id", content: p.username },
                { order: 1, name: "Age", content: p.age || "-", prefix: "Age:" },
                { order: 1, name: "Weight/Height", content: (p.weight || "-") + '/' + (p.height || "-"), prefix: "W/H:" },
                { order: 1, name: "bed", content: p.bed, postfix: "Bed" },
            ],
            features: [
                { label: "HR", unit: "bpm", config: getHRConfig() },
                { label: "SPO2", unit: "%", config: getSpo2Config() },
                { label: "TEMP", unit: "°C", config: getTemperatureConfig() },
                { label: "BP", unit: "mmHg", config: getBPConfig(), valueUpdate: true },
                { label: "RESP", unit: "bpm", config: getRespConfig() },
            ],
        }));
    }
}

function rtd_ai_detection(result) {
    let { data } = result;
    let app = apps[result.username];
    if (!app)
        return;


    app.alert = app.alert || new Object();

    if (result.topic == "SepsisAI") {
        let sepsisdata = data.sepsis;
        let sepsisvalue = Number(sepsisdata.Result);
        let pid = result.username;
        let sepsistime = TimeConvert(sepsisdata.time);
        //toasts
        console.log(app.alert);
        let alertPopup = true;
        if (app.alert[result.topic]) {
            let curt = Number(new Date());
            if (app.alert[result.topic].timeout >= curt) {
                alertPopup = false;
            } else {
                delete app.alert[result.topic];
            }
        }

        if (alertPopup && sepsisvalue > 0.7) {
            app.alert[result.topic] = {
                timeout: Number(new Date()) + 30 * 1000,
            }
            app.profile.find(v => v.name == "id").setColor("red");
            let bed = app.profile.find(v => v.name == "bed").content
            cuteToast({
                type: "error", // or 'info', 'error', 'warning'
                title: "Sepsis AI EWS Alert: high risk",
                message: `${pid}(${bed} bed) \n ${sepsistime}`,
                img: "img/error.svg",
                timer: 5000
            })
            app.container.style.boxShadow = "0px 0px 10px red";
        }
    }
}

function TimeConvert(t) {
    return UNIX2TIMESTAMP(Number(t));
}

function UNIX2TIMESTAMP(unix) {
    let date = new Date(unix);
    return date.toLocaleString().substr(-8);
}

function rtd_data_update(info) {
    // can put in config
    // console.log("[update info]", info);
    const MAX = 60;
    let match = info.topic.match(/Lifecare10\/(\S+)/);
    if (match) {
        let { data } = info;
        // console.log( data );
        let user = match[1];
        let app = apps[user];

        let Heart, Temperature, NiBP, PPG, Resp;





        if (app === undefined)
            return console.error("App is found."); // app is not found 
        if (info.data.waveform != undefined) {
            PPG = info.data.waveform;
        }
        if (data.spo2_HeartRate != undefined) {
            Heart = data.spo2_HeartRate;
            let hrval = Number(Heart.HeartRate);
            let hr = hrval['toFixed'] && hrval['toFixed'](0) || hrval;
            let hrtime = TimeConvert(Heart.time);
            let spo2val = Number(Heart.Spo2);
            let spo2 = spo2val['toFixed'] && spo2val['toFixed'](0) || spo2val;
            let spo2time = hrtime;

            if (app.feature.HR.config.data.labels.length > MAX) {
                app.feature.HR.config.data.labels.shift();
                app.feature.HR.config.data.datasets[0].data.shift();
            }
            app.feature.HR.config.data.labels.push((hrtime));
            app.feature.HR.config.data.datasets[0].data.push(hr);
            app.feature.HR.update(hr);
            app.feature.HR.setColor(hr >= 40 && hr <= 120 ? "black" : "red");

            if (app.feature.SPO2.config.data.labels.length > MAX) {
                app.feature.SPO2.config.data.labels.shift();;
                app.feature.SPO2.config.data.datasets[0].data.shift();
            }
            app.feature.SPO2.config.data.labels.push(spo2time);
            app.feature.SPO2.config.data.datasets[0].data.push(spo2);
            app.feature.SPO2.update(spo2);
            app.feature.SPO2.setColor(spo2 >= 95 && spo2 <= 100 ? "black" : "red");
        }
        if (info.data.Temperature != undefined) {
            Temperature = info.data.Temperature;
            let tempval = Number(Temperature.Temperature);
            let temp = tempval['toFixed'] && tempval['toFixed'](2) || tempval;
            let temptime = TimeConvert(Temperature.time);

            if (app.feature.TEMP.config.data.labels.length > MAX) {
                app.feature.TEMP.config.data.labels.shift();;
                app.feature.TEMP.config.data.datasets[0].data.shift();
            }
            app.feature.TEMP.config.data.labels.push(temptime);
            app.feature.TEMP.config.data.datasets[0].data.push(temp);
            app.feature.TEMP.update(temp);
            app.feature.TEMP.setColor(temp >= 36 && temp <= 37.5 ? "black" : "red");
        }
        if (info.data.NiBP != undefined) {
            NiBP = info.data.NiBP;
            let sbpval = Number(NiBP.SBP);
            let sbp = sbpval['toFixed'] && sbpval['toFixed'](0) || sbpval;
            let dbpval = Number(NiBP.DBP);
            let dbp = dbpval['toFixed'] && dbpval['toFixed'](0) || dbpval;
            let mapval = Number(NiBP.MAP);
            let map = mapval['toFixed'] && mapval['toFixed'](0) || mapval;
            let bptime = TimeConvert(NiBP.time);

            let dbset = app.feature.BP.config.data.datasets;
            let BPlastValue = {
                DBP: dbset[0].data[dbset[1].data.length - 1],
                SBP: dbset[1].data[dbset[0].data.length - 1],
                MAP: dbset[2].data[dbset[2].data.length - 1],
            }
            if ((dbp === '-' || sbp === '-' || map === '-') ||
                (dbp != BPlastValue.DBP || sbp != BPlastValue.SBP || map != BPlastValue.MAP)) {
                app.feature.BP.valueUpdate = true;
            }

            if (app.feature.BP.valueUpdate) {
                if ((dbp !== '-' && sbp !== '-' && map !== '-')) {
                    if (app.feature.BP.config.data.labels.length > MAX) {
                        app.feature.BP.config.data.labels.shift();;
                        app.feature.BP.config.data.datasets[0].data.shift();
                        app.feature.BP.config.data.datasets[1].data.shift();
                        app.feature.BP.config.data.datasets[2].data.shift();
                    }
                    app.feature.BP.config.data.labels.push(bptime);
                    app.feature.BP.config.data.datasets[0].data.push(dbp);
                    app.feature.BP.config.data.datasets[1].data.push(sbp);
                    app.feature.BP.config.data.datasets[2].data.push(map);
                    app.feature.BP.valueUpdate = false;
                }
                app.feature.BP.update(sbp + "/" + dbp);
                app.feature.BP.setColor(sbp >= 90 && sbp <= 140 && dbp >= 60 && dbp <= 90 ? "black" : "red");
            }
        }
        if (info.data.Resp != undefined) {
            Resp = info.data.Resp;
            let respval = Number(Resp.Resp);
            let resp = respval['toFixed'] && respval['toFixed'](0) || respval;
            let resptime = TimeConvert(Resp.time);
            if (app.feature.RESP.config.data.labels.length > MAX) {
                app.feature.RESP.config.data.labels.shift();;
                app.feature.RESP.config.data.datasets[0].data.shift();
            }
            app.feature.RESP.config.data.labels.push(resptime);
            app.feature.RESP.config.data.datasets[0].data.push(resp);
            app.feature.RESP.update(resp);
            app.feature.RESP.setColor(resp > 12 && resp < 20 ? "black" : "red");
        }
        app.update();
    }
}