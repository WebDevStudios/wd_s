// Require our dependencies
var browserSync = require('browser-sync');
var gulp = require('gulp');

// Reload browsers on file changes.
gulp.task('browsersync', function() {
	browserSync.init({
		proxy: "testing.dev"
	});
	gulp.watch(['*.css', 'assets/js/*.js', 'assets/images/*']).on('change', reload);
});