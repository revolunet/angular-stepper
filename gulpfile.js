'use strict';

var gulp = require('gulp');
var pkg = require('./package.json');

// CONFIG
//
var config = require('./ngfactory.json');
config.pkg = pkg;
require('ng-factory')(gulp, config);

// TASKS
//
var runSequence = require('run-sequence');
gulp.task('build', function() {
  runSequence('ng:dist/clean', ['ng:dist/templates', 'ng:dist/scripts', 'ng:dist/styles']);
});
gulp.task('serve', function() {
  runSequence('ng-factory:src/clean', 'ng-factory:src/views', ['ng-factory:src/serve', 'ng-factory:src/watch']);
});
gulp.task('test', function() {
  runSequence('ng-factory:test/clean', 'ng-factory:src/karma~init', 'ng-factory:src/karma');
});

// ALIASES
//
gulp.task('default', ['build']);
gulp.task('dist', ['build']);
