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

describe('Requests:Devices', function () {
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

  describe('GET /api/devices', function () {

    it('returns a list of devices with _id and check status', function (done) {
      request
        .get('/api/devices')
        .end(function (err, res) {
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          res.body.forEach(function (device) {
            expect(device).to.be.an('object');
            expect(device).to.have.keys(['_id', 'check']);
          });
          done(err);
        });
    });

  });

  describe('GET /api/devices/:deviceId', function () {

    it('returns a device with _id, check status, and audio timestamp with _id', function (done) {
      request
        .get('/api/devices/' + device._id)
        .end(function (err, res) {
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys(['_id', 'check', 'audio']);
          expect(res.body.audio).to.be.an('array');
          res.body.audio.forEach(function (audio) {
            expect(audio).to.be.an('object');
            expect(audio).to.have.keys(['_id', 'deviceId', 'timestamp']);
          });
          done(err);
        });
    });

  });

  describe('POST /api/devices/:deviceId', function () {

    var deviceId;

    beforeEach(function () {
      deviceId = uuid.v4();
    });

    it('responds with 204', function (done) {
      request
        .post('/api/devices/' + deviceId)
        .attach('file', fixturePath)
        .field('timestamp', now)
        .expect(204, done);
    });

    it('triggers list', function (done) {
      request
        .post('/api/devices/' + deviceId)
        .attach('file', fixturePath)
        .field('timestamp', now)
        .end(function () {
          co(function* () {
            device = yield mongo.devices.findOne({_id: deviceId});
            expect(device).to.be.an('object');
            expect(device).to.have.keys(['_id', 'check']);
            done();
          })();
        });
    });

    it('creates a device', function (done) {
      request
        .post('/api/devices/' + deviceId)
        .attach('file', fixturePath)
        .field('timestamp', now)
        .end(function () {
          co(function* () {
            device = yield mongo.devices.findOne({_id: deviceId});
            expect(device).to.be.an('object');
            expect(device).to.have.keys(['_id', 'check']);
            done();
          })();
        });
    });

    it('creates audio entry', function (done) {
      request
        .post('/api/devices/' + deviceId)
        .attach('file', fixturePath)
        .field('timestamp', now)
        .end(function () {
          co(function* () {
            audio = yield mongo.audio.findOne({deviceId: deviceId});
            expect(audio).to.be.an('object');
            expect(audio).to.have.keys(['_id', 'deviceId', 'file', 'timestamp']);
            done();
          })();
        });
    });

    it('matches our fixture', function (done) {
      request
        .post('/api/devices/' + deviceId)
        .attach('file', fixturePath)
        .field('timestamp', now)
        .end(function () {
          co(function* () {
            var file = yield fs.readFile(fixturePath, 'base64');
            audio = yield mongo.audio.findOne({deviceId: deviceId});
            expect(file).to.equal(audio.file);
            done();
          })();
        });
    });

  });

  describe('PUT /api/devices/:deviceId', function () {

    it('responds with 204', function (done) {
      request
        .put('/api/devices/' + device._id)
        .send({check: false})
        .expect(204, done);
    });

    it('allows you to disable the light', function (done) {
      request
        .put('/api/devices/' + device._id)
        .send({check: false})
        .end(function () {
          co(function* () {
            device = yield mongo.devices.findOne({_id: device._id});
            expect(device.check).to.equal(false);
            done();
          })();

        });
    });

    it('allows you to enable the light', function (done) {
      request
        .put('/api/devices/' + device._id)
        .send({check: true})
        .end(function () {
          co(function* () {
            device = yield mongo.devices.findOne({_id: device._id});
            expect(device.check).to.equal(true);
            done();
          })();

        });
    });
  });

});
