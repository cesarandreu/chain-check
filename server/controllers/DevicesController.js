'use strict';

// modules
var fs = require('co-fs');

// methods
module.exports = {
  get: get,
  list: list,
  upload: upload,
  trigger: trigger
};

function* list () {
  this.body = yield this.mongo.devices.find({}, {}, {sort: {_id: -1}}).toArray();
}

function* get () {
  var Devices = this.mongo.devices,
    Audio = this.mongo.audio;

  var device = yield Devices.findOne({_id: this.params.deviceId});
  if (!device) {
    this.throw(404);
  }

  device.audio = yield Audio.find({
    deviceId: device._id
  }, {
    file: 0
  }, {
    sort: {
      timestamp: -1
    }
  }).toArray();

  this.body = device;
}

function* trigger () {
  var Devices = this.mongo.devices;

  var device = yield Devices.findOne({_id: this.params.deviceId });
  if (!device) {
    this.throw(404);
  }

  yield Devices.findAndModify({_id: this.params.deviceId}, {}, {
    $set: { check: !!this.request.body.check }
  }, {});

  this.io.emit({
    type: 'trigger',
    deviceId: this.params.deviceId,
    value: !!this.request.body.check
  });

  this.status = 204;
}

function* upload () {
  var Devices = this.mongo.devices,
    Audio = this.mongo.audio;

  var fields = this.request.body.fields,
    file = (this.request.body.files || {}).file,
    timestamp = parseInt(fields.timestamp, 10);

  // validate file and timestamp
  if (!file || !timestamp) {
    this.throw(422);
  }

  // Search for device, if not found insert one
  var device = yield Devices.findOne({_id: this.params.deviceId });
  if (!device) {
    device = yield Devices.insert({
      _id: this.params.deviceId,
      check: false
    });
    device = device[0];

    // list is now bigger, so update it
    this.io.emit({
      type: 'list'
    });
  }

  yield Audio.insert({
    timestamp: timestamp,
    deviceId: this.params.deviceId,
    file: yield fs.readFile(file.path, 'base64')
  });

  // audio now has more entries, so update it
  this.io.emit({
    type: 'audio',
    deviceId: this.params.deviceId
  });


  this.status = 204;
}
