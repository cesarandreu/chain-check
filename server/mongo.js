'use strict';

var comongo = require('co-mongo'),
  debug = require('debug'),
  config = require('./config');

var log = debug('app:log:mongo');

comongo.open = function* () {
  if (comongo.db) {
    log('closing connection');
    yield comongo.db.close();
  }

  // export mongo db instance
  var db = comongo.db = yield comongo.connect(config.mongo.url);

  // export default collections
  comongo.devices = yield db.collection('devices');
  comongo.audio = yield db.collection('audio');
};

module.exports = comongo;
