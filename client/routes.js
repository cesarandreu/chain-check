'use strict';

angular.module('chainCheck')
.config(function ($stateProvider) {

  $stateProvider

  .state('layout', {
    templateUrl: '/views/layout.html',
    controller: 'LayoutCtrl as Layout',
    abstract: true
  })

  .state('home', {
    url: '/',
    parent: 'layout',
    controller: 'HomeCtrl as Home',
    templateUrl: '/views/home.html'
  })

  // DEVICES
  .state('devices', {
    url: '/devices',
    abstract: true,
    template: '<ui-view />',
    parent: 'layout'
  })

  .state('devices.index', {
    url: '',
    templateUrl: '/views/devices/index.html',
    controller: 'DevicesIndexCtrl as Devices',
    resolve: {
      Devices: ['devices', function (devices) {
        return devices.list();
      }]
    }
  })

  .state('devices.show', {
    url: '/:deviceId',
    abstract: true,
    template: '<ui-view />',
    resolve: {
      Device: ['devices', '$stateParams', function (devices, $stateParams) {
        return devices.get($stateParams);
      }]
    }
  })

  .state('devices.show.view', {
    url: '',
    templateUrl: '/views/devices/show.html',
    controller: 'DevicesShowCtrl as Device'
  })

  .state('devices.show.maintenance', {
    url: '/maintenance',
    templateUrl: '/views/devices/maintenance.html',
    controller: 'DevicesMaintenanceCtrl as Device'
  });

  // // VISUALIZATIONS
  // .state('visualizations', {
  //   url: '/visualizations',
  //   abstract: true,
  //   template: '<ui-view />',
  //   parent: 'layout'
  // })

  // .state('visualizations.new', {
  //   url: '/new',
  //   templateUrl: '/views/visualizations/new.html',
  //   controller: 'VisualizationsNewCtrl as Visualization',
  //   resolve: {
  //     databases: ['Treasure', function (Treasure) {
  //       return Treasure.getDatabases();
  //     }],
  //     types: ['Treasure', function (Treasure) {
  //       return Treasure.getTypes();
  //     }]
  //   }
  // })

  // .state('visualizations.index', {
  //   url: '',
  //   templateUrl: '/views/visualizations/index.html',
  //   controller: 'VisualizationsIndexCtrl as Visualizations',
  //   resolve: {
  //     VisualizationsList: ['Visualization', function (Visualization) {
  //       return Visualization.list();
  //     }]
  //   }
  // })

  // .state('visualizations.show', {
  //   url: '/:visualizationId',
  //   templateUrl: '/views/visualizations/show.html',
  //   controller: 'VisualizationsShowCtrl as Visualization',
  //   resolve: {
  //     Model: ['Visualization', '$stateParams', function (Visualization, $stateParams) {
  //       return Visualization.get($stateParams);
  //     }]
  //   }
  // })

  // // DASHBOARDS
  // .state('dashboards', {
  //   url: '/dashboards',
  //   abstract: true,
  //   template: '<ui-view />',
  //   parent: 'layout',
  // })

  // .state('dashboards.new', {
  //   url: '/new',
  //   templateUrl: '/views/dashboards/new.html',
  //   controller: 'DashboardsNewCtrl as Dashboard'
  // })

  // .state('dashboards.index', {
  //   url: '',
  //   templateUrl: '/views/dashboards/index.html',
  //   controller: 'DashboardsIndexCtrl as Dashboards',
  //   resolve: {
  //     DashboardsList: ['Dashboard', function (Dashboard) {
  //       return Dashboard.list();
  //     }]
  //   }
  // })

  // .state('dashboards.show', {
  //   url: '/:dashboardId',
  //   templateUrl: '/views/dashboards/show.html',
  //   controller: 'DashboardsShowCtrl as Dashboard',
  //   resolve: {
  //     Model: ['Dashboard', '$stateParams', function (Dashboard, $stateParams) {
  //       return Dashboard.get($stateParams);
  //     }],
  //     VisualizationsList: ['Visualization', function (Visualization) {
  //       return Visualization.list();
  //     }]
  //   }
  // });

})
.config(function ($urlRouterProvider) {
  $urlRouterProvider
    .otherwise('/')

    // Ripped off from here:
    // https://github.com/angular-ui/ui-router/issues/50#issuecomment-29339182
    // This rule removes trailing slashes on URLs.
    .rule(function ($injector, $location) {
      var path = $location.path(),
        search = $location.search(),
        params;

      // check to see if the path already doesn't end in '/'
      if (path[path.length - 1] !== '/') {
        return;
      }

      // If there was no search string / query params, return with stripped /
      if (Object.keys(search).length === 0) {
        return path.substring(0, path.length - 1);
      }

      // Otherwise build the search string and return without the trailing /
      params = [];
      angular.forEach(search, function (v, k) {
        params.push(k + '=' + v);
      });
      return path.substring(0, path.length - 1) + '?' + params.join('&');
    });
});
