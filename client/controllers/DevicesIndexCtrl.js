'use strict';

angular.module('chainCheck')
.controller('DevicesIndexCtrl', function (Devices) {
  this.list = Devices;

  this.status = function (device) {
    return device.check ? 'Bad' : 'Good';
  };

});
