'use strict';

// modules
var path = require('path'),
  fs = require('fs'),
  debug = require('debug');

var log = debug('app:log:controllers'),
  error = debug('app:error:controllers');

error.log = console.error.bind(console);

// Load controllers
var controllers = {};
fs.readdirSync(__dirname)
.filter(function (file) {
  return file.indexOf('index.js') === -1;
})
.forEach(function (file) {
  var name = file.split('.').shift();
  var controllerPath = path.join(__dirname, file);
  exports[name] = controllers[name] = require(controllerPath);
  log('%s loaded from file %s', name, controllerPath);
});
