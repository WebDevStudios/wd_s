// Require our dependencies
var cssnano = require('gulp-cssnano');
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');

// Minify and optimize style.css.
gulp.task('cssnano', function() {
	return gulp.src('style.css')

	// Wrap tasks in a sourcemap.
	.pipe(sourcemaps.init({
		loadMaps: true // Use the existing sourcemap.
	}))

		// Parse with CSS Nano.
		.pipe(cssnano({
			safe: true // Use safe optimizations
		}))

	// Create sourcemap.
	.pipe(sourcemaps.write())

	// Rename style.css to style.min.css
	.pipe(rename('style.min.css'))

	// Create style.min.css
	.pipe(gulp.dest('./'));
});