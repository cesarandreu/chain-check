'use strict';

angular.module('chainCheck')
.factory('socket', function (socketFactory) {
  return socketFactory({prefix: ''});
});
