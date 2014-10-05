'use strict';

angular.module('chainCheck')
.controller('DevicesMaintenanceCtrl', function (_, Device, devices) {

  _.merge(this, Device);

  this.status = function () {
    return this.check ? 'Bad' : 'Good';
  };

  this.set = function (value) {
    devices.status(Device._id, value);
  };

});
