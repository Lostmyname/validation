'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var getLmnTask = require('lmn-gulp-tasks');

var config = {
  css: {
    src: './demo/scss/*.{sass,scss}',
    dest: './demo/build'
  },
  js: {
    src: './demo/js/script.js',
    dest: './demo/build/bundle.js'
  },
  lint: {
    src: './src/**/*.js'
  },
  browser: {
    server: {
      baseDir: '.'
    },
    startPath: '/demo/index.html'
  }
};

gulp.task('auto-reload', getLmnTask('auto-reload'));

gulp.task('js-quality', getLmnTask('js-quality', config.lint));

gulp.task('js', ['js-quality'], getLmnTask('browserify', config.js));
gulp.task('scss', getLmnTask('scss', config.css));

gulp.task('js-watch', getLmnTask('browserify', {
  src: config.js.src,
  dest: config.js.dest,
  watch: true
}));

gulp.task('build', ['js', 'scss']);

gulp.task('default', ['build'], function () {
  browserSync.init([
    'build/**/*.css',
    'build/**/*.js',
    'test/**/*.js'
  ], config.browser);

  gulp.watch('./src/scss/**/*.{sass,scss}', ['scss']);
  gulp.watch(['./src/js/**/*.js', './demo/js/**/*.js'], ['js']);
});
