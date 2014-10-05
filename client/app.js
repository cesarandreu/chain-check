'use strict';

/**
 * Top level module. Lists all the other modules as dependencies.
 */

angular.module('chainCheck', [
  'ui.router',
  'ui.bootstrap',
  'toastr'
])

// Constants
.constant('$', window.$)
.constant('_', window._)

// This lets ui-router use normal-looking links instead of hashbangs
// More information:
// http://docs.angularjs.org/guide/dev_guide.services.$location#hashbang-and-html5-modes
.config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
})

// Redirect home on error
.run(function ($rootScope, $state, toastr) {
  $rootScope.$on('$stateChangeError', function () {
    toastr.error('An error has occurred');
    $state.go('home');
  });
});
