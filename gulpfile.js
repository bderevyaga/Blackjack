var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
	connect = require('gulp-connect');

gulp.task('default', ['connect']);	
	
gulp.task('connect', function() {
  connect.server({
    root: '',
    livereload: true
  });
});



