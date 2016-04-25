'use strict';
const gulp = require('gulp'),
      selenium = require('selenium-standalone'),
      webdriver = require('gulp-webdriver');

let seleniumServer;
gulp.task('selenium', done => {
  selenium.install(() => {
    selenium.start((err, child) => {
      if (err) return done(err);
      seleniumServer = child;
      done();
    });
  });
});

gulp.task('e2e', ['selenium'], () => {
  return gulp.src('wdio.conf.js')
    .pipe(webdriver()).on('error', () => {
      seleniumServer.kill();
      process.exit(1);
    });
});

gulp.task('test', ['e2e'], () => {
  seleniumServer.kill();
});
