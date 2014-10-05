'use strict';

angular.module('chainCheck')
.controller('DevicesShowCtrl', function (_, Device) {
  _.merge(this, Device);

  this.status = function () {
    return this.check ? 'Bad' : 'Good';
  };

});
