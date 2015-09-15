var gulp = require('gulp');
var gutil = require('gulp-util');
var notify = require("gulp-notify");

gulp.task('default', function() {
  return gulp.src("scss/main.scss")
    .pipe(notify("Got a file!"));
});