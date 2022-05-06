CLIENTS = [];

function sendAll(message) {
    for (var i = 0; i < CLIENTS.length; i++) {
        CLIENTS[i].send(message);
    }
}


module.exports = {
    sendAll,
    CLIENTS,
}