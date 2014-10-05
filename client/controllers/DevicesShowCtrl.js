'use strict';

angular.module('chainCheck')
.controller('DevicesShowCtrl', function (_, Device, ngAudio) {
  _.merge(this, Device);

  this.status = function () {
    return this.check ? 'Bad' : 'Good';
  };

  var sounds = {};
  this.play = function (id) {
    if (!sounds[id] || !sounds[id].remaining) {
      sounds[id] = ngAudio.load('/api/audio/' + id);
    }

    if (sounds[id].playing) {
      sounds[id].pause();
      sounds[id].playing = false;
    } else {
      sounds[id].play();
      sounds[id].playing = true;
    }
  };

  this.stop = function (id) {
    if (!sounds[id]) {
      return;
    }

    sounds[id].stop();
    sounds[id] = undefined;
  };

});
