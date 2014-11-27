'use strict';

//
// Required modules

var gulp = require('gulp');

//
// ngFactory setup

var config = require('./ngfactory.json');
config.pkg = require('./package.json');
require('ng-factory')(gulp, config);

//
// Example of custom tasks using before/after hooks

// var src = config.src;
// gulp.task('ng:afterBuild', function() {
//   gulp.src(['...'], {cwd: src.cwd, base: src.cwd})
//     .pipe(gulp.dest(src.dest));
// });
