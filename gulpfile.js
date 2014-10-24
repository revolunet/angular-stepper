'use strict';

var gulp = require('gulp');
var pkg = require('./package.json');
var run = require('run-sequence');

// CONFIG
//
var config = require('./ngfactory.json');
config.pkg = pkg;

config.requireTransform = function(name){
  return require('./transforms/' + name);
};


require('ng-factory')(gulp, config);


// TASKS
//
var runSequence = require('run-sequence');
gulp.task('build', function() {
  runSequence('ng:dist/clean', ['ng:dist/templates', 'ng:dist/scripts', 'ng:dist/styles']);
});
gulp.task('test', function() {
  runSequence('ng:test/clean', 'ng:test/templates', 'ng:src/karma~init', 'ng:src/karma');
});
gulp.task('serve', function() {
  runSequence('ng-factory:src/clean', 'ng-factory:src/views', ['ng-factory:src/serve', 'ng-factory:src/watch']);
});
gulp.task('readme', function (cb) {
  runSequence('ng-factory:docs/ngdocs', 'ng-factory:docs/readme', cb);
});

gulp.task('release', function(cb){
  run(
    'ng-factory:src/bump',
    'ng-factory:src/deploy:configPkgUpdate',
    'ng-factory:src/changelog',
    'ng-factory:src/deploy:src',
    cb);
});


// ALIASES
//
gulp.task('default', ['build']);
gulp.task('dist', ['build']);
