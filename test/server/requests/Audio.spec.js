'use strict';

var fs = require('co-fs'),
  path = require('path'),
  co = require('co');

var helper = require('../helper'),
  uuid = require('uuid'),
  mongo = helper.mongo;

var device, audio, now;

var fixturePath = path.resolve(__dirname, '../fixture.wav');

var expect = helper.expect,
  request = helper.request;

describe('Requests:Audio', function () {
  helper.beforeEachRequest();
  helper.afterEachRequest();

  beforeEach(function* () {

    now = Date.now();

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
  });

  describe('GET /api/audio/:audioId', function () {
    it('returns a wav type', function (done) {
      request
        .get('/api/audio/' + audio._id)
        .end(function (err, res) {
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          expect(res.type).to.equal('audio/x-wav');
          done(err);
        });
    });

    it('returns a wav file', function (done) {
      request
        .get('/api/audio/' + audio._id)
        .end(function (err, res) {
          co(function* () {
            // check utf-8 because supertest is stupid
            var file = yield fs.readFile(fixturePath, 'utf-8');
            expect(res.text).to.equal(file);
            done();
          })();
        });
    });

  });

});
