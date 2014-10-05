'use strict';

require('co-mocha');

var chai = require('chai'),
  supertest = require('supertest'),

  app = require('../../server/index.js'),
  mongo = require('../../server/mongo'),
  config = require('../../server/config');

var BASE_URL = exports.BASE_URL = 'http://localhost:' + config.port;

exports.request = supertest(BASE_URL);
exports.config = config;
exports.expect = chai.expect;
exports.mongo = mongo;

exports.beforeEachRequest = function () {
  beforeEach(function* () {
    yield app.init();
    yield mongo.db.dropDatabase();
  });
};

exports.afterEachRequest = function () {

  afterEach(function (done) {
    if (app.server) {
      app.server.close(done);
    } else {
      done('server not defined');
    }
  });

  afterEach(function* () {
    yield mongo.db.dropDatabase();
  });
};
