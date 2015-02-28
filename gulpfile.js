var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  notify = require('gulp-notify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat-util'),
  watch = require('gulp-watch'),
  clean = require('gulp-clean');

var srcFiles = ['src/moback_start.js', 'src/user_mgr.js', 'src/obj_mgr.js', 'src/query_mgr.js',
  'src/notification_mgr.js', 'src/file_mgr.js', 'src/ajax.js', 'src/moback_end.js'];

gulp.task('build-js', function() {
  return gulp.src(srcFiles)
    .pipe(concat('moback.js'))
    .pipe(concat.header('(function (window) {\n'))
    .pipe(concat.footer('}(window));'))
    .pipe(gulp.dest('dist/'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build-js-dev', function() {
  return gulp.src(srcFiles)
    .pipe(concat('moback.js'))
    .pipe(concat.header('(function (window) {\n'))
    .pipe(concat.footer('}(window));'))
    .pipe(gulp.dest('dist/'));
});

//watches the src js folder, and does a rebuild automatically
gulp.task("watch", function() {
  // calls "build-js" whenever anything changes
  gulp.watch("src/*.js", ["build-js"]);
});

//watches the src js folder, and does a rebuild automatically
gulp.task("watch-dev", function() {
  // calls "build-js" whenever anything changes
  gulp.watch("src/*.js", ["clean", "build-js-dev"]);
});

// Clean
gulp.task('clean', function () {
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

