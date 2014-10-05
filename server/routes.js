'use strict';

var Router = require('koa-router'),
  mount = require('koa-mount'),
  compose = require('koa-compose'),
  body = require('koa-body'),
  send = require('koa-send');

var controllers = require('./controllers'),
  config = require('./config');

module.exports = function routes () {
  // Controllers
  var DevicesController = controllers.DevicesController,
    AudioController = controllers.AudioController;

  // Routes
  var API = new Router();

  // Devices
  API.get('/devices', DevicesController.list);
  API.get('/devices/:deviceId', DevicesController.get);
  API.put('/devices/:deviceId', body(config.middleware.body), DevicesController.trigger);
  API.post('/devices/:deviceId', body(config.middleware.body), DevicesController.upload);

  // Audio
  API.get('/audio/:audioId', AudioController.get);

  return compose([
    filesMiddleware,
    mount('/api', API.middleware())
  ]);

};

// Helper middleware
// files server
function* filesMiddleware (next) {
  // skip any route that starts with /api as it doesn't have any static files
  if (this.path.substr(0, 5).toLowerCase() === '/api/') {
    return yield next;
  }

  // if the requested path matched a file and it is served successfully, exit the middleware
  if (yield send(this, this.path, config.middleware.send)) {
    return;
  }

  // if given path didn't match any file, just let angular handle the routing
  yield send(this, '/index.html', config.middleware.send);
}
