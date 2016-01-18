// Require our dependencies
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');

// Optimize images.
gulp.task('imagemin', function() {
	return gulp.src(paths.images)
	.pipe(imagemin({
		optimizationLevel: 5
	}))
	.pipe(gulp.dest('assets/images'));
});
