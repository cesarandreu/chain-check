'use strict';

// modules
var co = require('co'),
  http = require('http'),
  socketIO = require('socket.io'),
  debug = require('debug'),
  config = require('./config'),
  routes = require('./routes'),
  mongo = require('./mongo');

// koa
var koa = require('koa'),
  logger = require('koa-logger'),
  responseTime = require('koa-response-time'),
  compress = require('koa-compress');

var log = debug('app:log');
var app = koa();

app.name = config.name;
app.env = config.env;
app.context.config = config;
app.context.mongo = mongo;

// middleware
if (app.env !== 'test') {
  log('logger enabled');
  app.use(logger()); // logging
}

app.use(responseTime()); // x-response-time
app.use(compress(config.middleware.compress)); // compression
app.use(routes()); // routes

// initializers
// connect to db
// listen for connections
app.init = function* init () {
  log('initilizing');
  yield mongo.open();

  if (app.env === 'test') {
    yield require('./seed')(mongo);
  }

  app.server = http.Server(app.callback());
  app.context.io = socketIO(app.server);
  app.server.listen(config.port, function () {
    log('Server running on port %d', config.port);
  });
};

// auto start if the app is not being initialized by another module
app.start = co(app.init);
if (!module.parent) {
  log('No module parent, calling start');
  app.start();
}

// exports the app so it can be started externally
// if you require the app you're responsible for calling start or init
module.exports = app;
