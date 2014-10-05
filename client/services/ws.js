'use strict';

angular.module('chainCheck')
.service('devices', function ($http, $q) {
  this.list = function () {
    var deferred = $q.defer();
    $http
      .get('/api/devices')
      .success(function (devices) {
        deferred.resolve(devices);
      })
      .error(function (err) {
        deferred.reject(err);
      });
    return deferred.promise;
  };

  this.get = function (params) {
    params = params || {};
    var deferred = $q.defer();

    if (params.deviceId) {
      $http
        .get('/api/devices/' + params.deviceId)
        .success(function (device) {
          deferred.resolve(device);
        })
        .error(function (err) {
          deferred.reject(err);
        });
    } else {
      deferred.reject('device id required');
    }

    return deferred.promise;
  };

  this.status = function (id, value) {
    return $http.put('/api/devices/' + id, {
      check: value
    });
  };


});
