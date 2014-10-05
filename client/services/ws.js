'use strict';

angular.module('chainCheck')
.service('ws', function ($window) {
  var api = {events: {}};

  var wsHost = ($window.document.location.origin || ($window.location.protocol + '//' + $window.location.host)).replace(/^http/, 'ws');

  var ws = new WebSocket(wsHost);
  $window.setInterval(function () {
    ws.send('ping');
  }, 1000 * 25); // keep-alive signal


  // utilize jQuery's callbacks as an event system
  function event() {
    var callbacks = window.$.Callbacks();
    return {
      subscribe: function ($scope, fn) {
        if (fn) {
          // unsubscribe from event on controller destruction to prevent memory leaks
          $scope.$on('$destroy', function () {
            callbacks.remove(fn);
          });
        } else {
          fn = $scope;
        }
        callbacks.add(fn);
      },
      unsubscribe: callbacks.remove,
      publish: callbacks.fire
    };
  }

  // websocket connected disconnected events
  api.connected = event();
  ws.onopen = function () {
    api.connected.publish.apply(this, arguments);
    $rootScope.$apply();
  };

  api.disconnected = event();
  ws.onclose = function () {
    api.disconnected.publish.apply(this, arguments);
    $rootScope.$apply();
  };


});
