'use strict';

var WebSocketServer = require('ws').Server,
  uuid = require('uuid'),
  _ = require('lodash'),
  debug = require('debug');

var log = debug('app:ws:log');

exports.listen = function (server) {
  var wss = new WebSocketServer({
    server: server,
    verify: function () {
      return true;
    }
  });

  wss.on('connection', function (ws) {
    var user = uuid.v4();

    log('websocket client connected %s', user);

    if (exports.clients[user]) {
      exports.clients[user].push(ws);
    } else {
      exports.clients[user] = [ws];
    }

    ws.on('close', function () {
      log('websocket client disconnected %s', user);
      if (exports.clients[user].length === 1) {
        exports.clients[user] = null;
      }
      else {
        var index = exports.clients[user].indexOf(ws);
        exports.clients[user].splice(index, 1);
      }
    });

    ws.on('error', function (err) {
      log('websocket client error %s %s', user, err);
    });

    ws.on('message', function (data) {
      if (data !== 'ping') {
        log('unexpected websocket message received from client with data: %s', JSON.parse(data));
      }
    });

    exports.wss = wss;
    return wss;

  });
};

exports.clients = [];

exports.notify = function (recipients, method, params) {
  if (!Array.isArray(recipients)) {
    params = method;
    method = recipients;
    recipients = _.keys(exports.clients);
  }
  var data = JSON.stringify({jsonrpc: '2.0', method: method, params: params});

  // send the data to only the online recipients
  var send = function (client) {
    client.send(data, function (err) {
      // if error is null, the send has been completed
      if (err) {
        console.log('A WebSocket error occurred: %s', err);
      }
    });
  };

  for (var i = 0; i < recipients.length; i++) {
    var recipient = recipients[i],
        onlineClients = exports.clients[recipient];
    if (onlineClients) {
      onlineClients.forEach(send);
    }
  }
};
