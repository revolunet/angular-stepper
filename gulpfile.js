'use strict';

var gulp = require('gulp');
var run = require('run-sequence');

// CONFIG
//
var config = require('./ngfactory.json');
var pkg = require('./package.json');
config.pkg = pkg;
var bower = require('./bower.json');
config.bower = bower;

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
  runSequence('ng:test/clean', ['ng:test/templates', 'ng:test/karma~init'], ['ng:test/karma', 'ng:test/jshint']);
});
gulp.task('serve', function() {
  runSequence('ng:docs/clean', 'ng:docs/views', ['ng:docs/serve', 'ng:docs/watch']);
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
