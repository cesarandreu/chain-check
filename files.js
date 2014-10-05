'use strict';

module.exports = {
  application: [
    '/index.jade'
  ],
  templates: [
    '/{views,templates}/{**/,}*.jade'
  ],
  scripts: [

    // Major Libraries
    '/lib/jquery/dist/jquery.js',
    '/lib/lodash/dist/lodash.js',
    '/lib/socket.io/socket.io.js',
    '/lib/angular/angular.js',

    // Wavesurfer
    '/lib/wavesurfer.js/src/wavesurfer.js',
    '/lib/wavesurfer.js/src/webaudio.js',
    '/lib/wavesurfer.js/src/audioelement.js',
    '/lib/wavesurfer.js/src/drawer.js',
    '/lib/wavesurfer.js/src/drawer.canvas.js',

    // Wavesurfer plugin
    // '/lib/wavesurfer.js/plugin/wavesurfer.timeline.js',

    // AngularJS Libraries
    '/lib/ui-router/release/angular-ui-router.js',
    '/lib/angular-bootstrap/ui-bootstrap-tpls.js',
    '/lib/angular-toastr/dist/angular-toastr.js',
    '/lib/ngAudio/angular.audio.js',

    // Application
    '/app.js',
    '/routes.js',
    '/templates.js',
    '/controllers/{**/,}*.js',
    '/services/{**/,}*.js',
    '/directives/{**/,}*.js'
  ],
  styles: [
    '/lib/angular-toastr/dist/angular-toastr.css',
    '/lib/bootstrap/less/bootstrap.less',
    '/styles/main.less'
  ],
  images: [
    '/img/{**/,}*'
  ],
  fonts: [
    '/lib/bootstrap/dist/fonts/*'
  ]
};
