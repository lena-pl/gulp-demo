var gulp = require('gulp');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var GulpSSH = require('gulp-ssh');
var autoprefixer = require('gulp-autoprefixer');

var config = require('./gulp-config.json');

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

// configure the deployment task
var gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config
});

gulp.task('deploy', function () {
  return gulp.src(['./**/*', '!**/node_modules/**', '!./*.js*', '!./scripts', '!./scss'])
    .pipe(gulpSSH.dest('/home/lenaplaksina/public_html/cuba-cameras/'))
})

// configure the scss task
gulp.task('build-css', function() {
  return gulp.src([
      'bower_components/magnific-popup/dist/magnific-popup.css',
      'scss/main.scss'
    ])
    .pipe(sourcemaps.init())
      .pipe(sass()
        .on('error', function(err) {
          notify({title: "Sass Error"}).write(err);
          this.emit('end');
        })
      )
      .pipe(autoprefixer({
        browsers: ['last 2 versions', '> 2% in NZ', 'Explorer >= 9']  
      }))
      .pipe(concat('main.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
    .pipe(notify("Css compiled!"));
});

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('scripts/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(notify("JS checked!"));
});

// configure the js concat task
gulp.task('build-js', function() {
  return gulp.src([
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/magnific-popup/dist/jquery.magnific-popup.min.js',
      'scripts/**/*.js'

    ])
    .pipe(sourcemaps.init())
      //only uglify if gulp is ran with '--type production'
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
      .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('js'))
    .pipe(notify("JS files compiled!"));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch(['scss/**/*.scss'], ['build-css'])
    .on('change', function(event) {
      gutil.log('File ' + gutil.colors.magenta(event.path) + ' was ' + event.type + '...');
    });
  gulp.watch(['scripts/**/*.js'], ['jshint'])
    .on('change', function(event) {
      gutil.log('File ' + gutil.colors.green(event.path) + ' was ' + event.type + '...');
    });
  gulp.watch(['scripts/**/*.js'], ['build-js'])
    .on('change', function(event) {
      gutil.log('File ' + gutil.colors.black(event.path) + ' was ' + event.type + '...');
    });
});