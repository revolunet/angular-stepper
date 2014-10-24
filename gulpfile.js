'use strict';

var gulp = require('gulp');
var pkg = require('./package.json');

// CONFIG
//
var config = require('./ngfactory.json');
config.pkg = pkg;
require('ng-factory').app(gulp, config);
// gulp, pkg, module, type(app/comp), {+++}.


// TASKS
//
var src = config.src;
gulp.task('dist/copy', function() {
  // gulp.src(['bower_components/jsoneditor/jsoneditor.min.css', 'bower_components/jsoneditor/img/*.png'], {cwd: src.cwd, base: src.cwd})
  //   .pipe(gulp.dest(src.dest));
});

// ALIASES
//
var runSequence = require('run-sequence');
gulp.task('default', ['build']);
gulp.task('dist', ['build']);
gulp.task('test', function() {
  runSequence('ng-factory:test/clean', 'ng-factory:src/karma~init', 'ng-factory:src/karma');
});
gulp.task('build', function() {
  runSequence('ng-factory:dist/clean', 'ng-factory:src/views', ['ng-factory:dist/views', 'ng-factory:dist/copy'], 'dist/copy');
});
gulp.task('serve', function() {
  runSequence('ng-factory:src/clean', 'ng-factory:src/views', ['ng-factory:src/serve', 'ng-factory:src/watch']);
});
