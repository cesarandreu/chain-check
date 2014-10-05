'use strict';

// methods
module.exports = {
  get: get
};

function* get () {
  var Audio = this.mongo.audio;

  var audio = yield Audio.findOne({_id: this.params.audioId});
  if (!audio) {
    this.throw(404);
  }

  this.type = 'audio/x-wav';
  this.body = new Buffer(audio.file, 'base64');
}
