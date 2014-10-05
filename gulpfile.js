'use strict';

var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  del = require('del'),
  gulpif = require('gulp-if'),
  newer = require('gulp-newer'),
  jade = require('gulp-jade'),
  rev = require('gulp-rev'),
  mincss = require('gulp-minify-css'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  revCollector = require('gulp-rev-collector'),
  htmlmin = require('gulp-htmlmin'),
  clone = require('gulp-clone'),
  less = require('gulp-less'),
  uglify = require('gulp-uglify'),
  templateCache = require('gulp-angular-templatecache'),
  runSequence = require('run-sequence'),
  ngannotate = require('gulp-ng-annotate'),
  mergeStream = require('merge-stream'),
  openurl = require('openurl'),
  glob = require('glob'),
  path = require('path'),
  _ = require('lodash');

// non-production modules
if (!_.contains(process.env.NODE_ENV, 'production')) {
    var livereload = require('gulp-livereload');
}

// context
var context = require('./context.js');

// files manifest
var prefixed = {};
var files = require('./files.js');
_.each(files, function (value, key) {
  prefixed[key] = _.map(value, function (file) {
    return path.join('client', file);
  });
});

// cleans public folder
gulp.task('clean', function (cb) {
  del(['public/**'], cb);
});

/*************************
 *** DEVELOPMENT TASKS ***
 *************************/

// launches tdViz server
gulp.task('dev-server', function () {
  nodemon({
    script: 'server/index.js',
    ext: 'js',
    nodeArgs: ['--harmony', '--debug'],
    watch: ['server/**/*'],
    ignore: ['console', 'test'],
    env: {
      NODE_ENV: process.env.NODE_ENV || 'test'
    }
  });
});

// copies scripts
gulp.task('dev-scripts', function () {
  return gulp
    .src(prefixed.scripts, {base: 'client'})
    .pipe(newer({
      dest: 'public'
    }))
    .pipe(gulp.dest('public'));
});

// compiles templates
gulp.task('dev-templates', function () {
  return gulp
    .src(prefixed.templates, {base: 'client'})
    .pipe(newer({
      dest: 'public',
      ext: '.html'
    }))
    .pipe(gulpif(/\.jade$/, jade({
      pretty: true,
      doctype: 'html',
      locals: context
    })))
    .pipe(gulp.dest('public'));
});

// compiles application
gulp.task('dev-application', function () {

  function stripPrefix (file) {
    console.log(file);
    if (_.contains(file, '.less')) {
      file = file.replace('.less', '.css');
    }
    return file.split('client').join('');
  }

  function pushTo (ctx, to) {
    ctx[to] = [];
    return function (str) {
      _.each(glob.sync(str), function (file) {
        ctx[to].push(stripPrefix(file));
      });
    };
  }

  var ctx = _.clone(context);
  _.each(prefixed.styles, pushTo(ctx, 'styles', 'css'));
  _.each(prefixed.scripts, pushTo(ctx, 'scripts', 'js'));

  return gulp
    .src(prefixed.application, {base: 'client'})
    .pipe(jade({
      pretty: true,
      doctype: 'html',
      locals: ctx
    }))
    .pipe(gulp.dest('public'));
});

// compiles styles
gulp.task('dev-styles', function () {
  return gulp
    .src(prefixed.styles, {base: 'client'})
    // .pipe(newer({
    //   dest: 'public',
    //   ext: '.css'
    // }))
    .pipe(gulpif(/\.less$/, less({
      errLogToConsole: true,
      sourceComments: 'map'
    })))
    .pipe(gulp.dest('public'));
});

gulp.task('dev-copy', function () {
  var fileList = []
    .concat(prefixed.fonts)
    .concat(prefixed.images);

  return gulp
    .src(fileList, {base: 'client'})
    .pipe(newer({
      dest: 'public'
    }))
    .pipe(gulp.dest('public'));
});

gulp.task('dev-open', function () {
  openurl.open('http://localhost:4000/');
});

gulp.task('dev-watch', function () {
  var copyList = []
    .concat(prefixed.fonts)
    .concat(prefixed.images),
  lr = livereload();

  gulp.watch(prefixed.scripts, ['dev-scripts']);
  gulp.watch('client/styles/**', ['dev-styles']);
  gulp.watch(prefixed.templates, ['dev-templates']);
  gulp.watch(prefixed.application, ['dev-application']);
  gulp.watch(copyList, ['dev-copy']);

  gulp.watch('public/**')
  .on('change', function (file) {
    console.log(file);
    lr.changed(file.path);
  });

});

gulp.task('dev', function (cb) {
  runSequence(
    'clean',
    ['dev-server', 'dev-scripts', 'dev-templates', 'dev-styles', 'dev-application', 'dev-copy'],
    ['dev-watch', 'dev-open'],
    cb
  );
});


/******************
 *** BUILD TASK ***
 ******************/

gulp.task('build-assets', function () {

  // Get all images
  // Save to /img folder
  // Rev and save to /img folder
  // Get the rev manifest
  var images = gulp
    .src(prefixed.images, {base: 'client'})
    .pipe(gulp.dest('public'))
    .pipe(rev())
    .pipe(gulp.dest('public'))
    .pipe(rev.manifest());

  // Get styles
  // Compile less
  // Minify styles
  // Concatenate files
  var styles = gulp
    .src(prefixed.styles, {base: 'client'})
    .pipe(gulpif(/\.less$/, less({
      errLogToConsole: true,
    })))
    .pipe(mincss())
    .pipe(concat('/styles.css'));

  // Merge styles stream with cloned images-manifest stream
  // Replace image links in css
  // Rev and save to /styles folder
  styles = mergeStream(styles, images.pipe(clone()))
    .pipe(revCollector())
    .pipe(rev())
    .pipe(gulp.dest('public'));

  // Get all templates
  // Compile jade files
  // Minify html
  // Aply preprocessor
  var templates = gulp
    .src(prefixed.templates, {base: 'client'})
    .pipe(jade({
      pretty: false,
      doctype: 'html',
      locals: context
    }))
    .pipe(htmlmin({
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    }));

  // Merge templates stream with cloned images-manifest stream
  // Replace image links in templates
  // Save templates to /template and /views
  // Convert all templates into angularjs injectable strings
  templates = mergeStream(templates, images.pipe(clone()))
    .pipe(revCollector())
    .pipe(gulp.dest('public')) // should also copy over templates
    .pipe(templateCache({
      module: 'tdViz'
    }));
    // .pipe(rename(function (file) {
    //   // Renames from ./templates.js to ./scripts/templates.js
    //   file.dirname = path.join(file.dirname, );
    //   return file;
    // }));

  // Get all scripts
  var scripts = gulp.src(prefixed.scripts, {base: 'client'});

  // Compile coffeescript
  // Apply preprocessor
  // Apply ngannotate
  // Merge scripts stream with javascript-ified templates
  // UglifyJS will concatenate and minify everything
  // Rev (only js files, so it'll ignore source maps) and save to /scripts folder
  scripts = mergeStream(scripts, templates)
    .pipe(gulpif(function (file) {
      return file.path.indexOf('bower_components') === -1;
    }, ngannotate({
      add: true,
      single_quotes: true
    })))
    .pipe(gulp.dest('public'))
    .pipe(sourcemaps.init())
    .pipe(concat('/scripts.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('/', {sourceRoot: '/'}))
    .pipe(gulpif(/\.js$/, rev()))
    .pipe(gulp.dest('public'));

  return mergeStream(scripts, styles);
});

gulp.task('copy-assets', function () {
  var fileList = []
    .concat(prefixed.fonts);

  return gulp
    .src(fileList, {base: 'client'})
    .pipe(gulp.dest('public'));
});

// Renders main.html application, injects .js/.css files
gulp.task('build-application', function () {
  function removePublic (file) { return file.split('public').pop(); }

  var ctx = _.clone(context);
  ctx.scripts = glob.sync('public/scripts-*.js').map(removePublic);
  ctx.styles = glob.sync('public/styles-*.css').map(removePublic);

  return gulp
    .src(prefixed.application, {base: 'client'})
    .pipe(jade({
      pretty: true,
      doctype: 'html',
      locals: ctx
    }))
    .pipe(gulp.dest('public'));

});

gulp.task('build', function (cb) {
  runSequence(
    'clean',
    ['build-assets', 'copy-assets'],
    'build-application',
    cb
  );
});

