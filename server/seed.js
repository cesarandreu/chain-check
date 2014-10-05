'use strict';

var path = require('path'),
  uuid = require('uuid'),
  fs = require('co-fs'),
  fixturePath = path.resolve(__dirname, '../test/server/fixture.wav');

module.exports = function* seed (mongo) {
  yield mongo.db.dropDatabase();

  var now = Date.now();
  var device, audio;

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
    file: yield fs.readFile(fixturePath, 'base64')
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
    file: yield fs.readFile(fixturePath, 'base64')
  });
  audio = audio[0];

};
