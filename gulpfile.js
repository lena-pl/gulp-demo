var gulp = require('gulp');
var gutil = require('gulp-util');

gulp.task('default', function() {
	return gutil.log(gutil.colors.gray.bgYellow(" Doing a thing "));
});