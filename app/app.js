require("dotenv").config();
const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const ws = require("ws");
const express = require("express")
const session = require("express-session");
const path = require('path');
const bodyParser = require('body-parser');


const install_apps = require("./install_apps");

// template engine
const { engine } = require("express-handlebars");

process.env.DBPATH = path.join(__dirname, "database");

/////////////////////// Controller ///////////////////////
const _SPORT = parseInt(process.env.SPORT) || 8443; // https server port
const _PORT = parseInt(process.env.PORT) || 8000; // this can put in the config file
const expressServer = express()
const server = http.createServer(expressServer);
const ssl = require("./bin/SSL");
const sserver = https.createServer(ssl.options, expressServer);
const wss = new Object(); // contains all websocket server

//setting middleware
expressServer.use(bodyParser.urlencoded({ extended: true }));

// TODO:
// Not allow cross apps module accessing different views template

let app_view = Object.keys(install_apps).map(app => `${__dirname}/Module/${install_apps[app]}/views`);
let partialsDir = Object.keys(install_apps).map(app => `${__dirname}/Module/${install_apps[app]}/views/partials`);

let hbsEngine = engine({ extname: '.hbs', layoutsDir: path.resolve(__dirname, 'templates'), partialsDir });
//hbsEngine.registerHelper('include', require('handlebars-helper-include'));
expressServer.engine(".hbs", hbsEngine);
expressServer.set('view engine', '.hbs');
expressServer.set("views", app_view);

expressServer.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

expressServer.use(session({
    secret: 'random_secret',
    cookie: { maxAge: 120 * 24 * 60 * 60 * 1000 },
}));

// User Space's routing rules

for (let app_name in install_apps) {
    let app_path = install_apps[app_name];
    CreateServer(app_path, app_name);
}

server.on("upgrade", Upgrade2Socket);
sserver.on("upgrade", Upgrade2Socket);

server.listen(_PORT, () => {
    console.log(`server is running at http://127.0.0.1:${_PORT}`);
});

sserver.listen(_SPORT, () => {
    console.log(`\x1b[32m[HTTPS] server is running at https://127.0.0.1${_SPORT == "443" ? "" : ':' + _SPORT}\x1b[0m`);
})

function Upgrade2Socket(request, socket, head) {
    const { pathname } = url.parse(request.url);
    let socket_app = wss[pathname];
    if (socket_app) {
        socket_app['server'].handleUpgrade(request, socket, head, function done(wserver) {
            socket_app['server'].emit('connection', wserver, request);
        });
    } else {
        socket.destroy();
    }
}

function CreateServer(app_path, app_name) {
    let routing_rule = app_name == "Main" ? "/" : `/${app_name}/`;

    let app_config = require(`./Module/${app_path}/config`);
    let ws_path = null;
    // Socket routing rule is wss://${host}/${Module_Name}/ws
    if (app_config.socket) {
        ws_path = routing_rule + "ws";
        wss[ws_path] = {
            server: new ws.WebSocketServer({ noServer: true }),
            socket: require(`${__dirname}/Module/${app_path}/${app_config.socket}`),
        };

        wss[ws_path]['server'].on("connection", wss[ws_path].socket.connection);
    }

    if (app_config.route) {
        expressServer.use(routing_rule, (req, res, next) => {
            let originRender = res.render;
            // This colud be a new vulnerability
            res.render = (template, data) => {

                if (data['layout'] != undefined) {
                    let layout_path = path.resolve("Module", app_path, 'views', 'layouts', data['layout']);;

                    // check file in the layout_path is exist
                    if (data['layout'] && fs.existsSync(layout_path + ".hbs")) { // Not a good way to access the layout
                        data['layout'] = layout_path;
                    }
                }
                return originRender.call(res, template, data);
            }
            if (ws_path !== null && wss[ws_path]) {
                res.ws_service = wss[ws_path].socket;
            }
            require(`${__dirname}/Module/${app_path}/${app_config.route}`)(req, res, next);
        });
    }
}
