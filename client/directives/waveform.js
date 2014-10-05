'use strict';

angular.module('chainCheck')
.directive('waveform', function () {
  return {
    templateUrl: '/templates/waveform.html',
    restrict: 'E',
    scope: {
      audio: '@'
    },
    link: function (scope, iElement) {

      var waveElement = iElement[0].querySelector('.waveform');

      var wavesurfer = Object.create(window.WaveSurfer);

      var loaded = false;

      wavesurfer.init({
        container: waveElement,
        waveColor: 'violet',
        progressColor: 'purple'
      });

      wavesurfer.on('ready', function () {
        loaded = true;
      });

      wavesurfer.load(scope.audio);

      scope.playPause = function () {
        if (loaded) {
          wavesurfer.playPause();
        }
      };

      scope.$on('destroy', function () {
        wavesurfer.destroy();
      });

    }
  };
});
