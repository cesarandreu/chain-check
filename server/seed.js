'use strict';

var path = require('path'),
  pcm = require('pcmjs'),
  uuid = require('uuid'),
  config = require('./config'),
  fs = require('co-fs'),
  fixturePath = path.resolve(__dirname, '../test/server/fixture');

module.exports = function* seed (mongo) {
  yield mongo.db.dropDatabase();

  var now = Date.now();
  var device, audio;

  var buff = yield fs.readFile(fixturePath);
  var arr = [];
  for (var i = 0; i < buff.length; i++) {
    arr.push(buff[i]);
  }

  var data = (new pcm(config.pcmjs))
    .toWav(arr)
    .encode()
    .split('data:audio/wav;base64,')
    .pop();

  device = yield mongo.devices.insert({
    _id: uuid.v4(),
    check: true
  });
  device = device[0];

  audio = yield mongo.audio.insert({
    _id: uuid.v4(),
    deviceId: device._id,
    timestamp: now,
    file: yield fs.readFile(fixturePath, 'base64')
  });
  audio = audio[0];

  audio = yield mongo.audio.insert({
    _id: uuid.v4(),
    deviceId: device._id,
    timestamp: now,
    file: data
  });
  audio = audio[0];

  device = yield mongo.devices.insert({
    _id: uuid.v4(),
    check: false
  });
  device = device[0];

  audio = yield mongo.audio.insert({
    _id: uuid.v4(),
    deviceId: device._id,
    timestamp: now,
    file: data
  });
  audio = audio[0];

};
