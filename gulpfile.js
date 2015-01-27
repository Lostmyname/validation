'use strict';

var gulp = require('gulp');
var getLmnTask = require('lmn-gulp-tasks');

gulp.task('js', getLmnTask('browserify', {
  src: './src/index.js',
  dest: './dest/bundle.js'
}));

gulp.task('default', ['js'], function () {
  gulp.watch('./src/**/*.js', ['js']);
});
