// Require our dependencies
var concat = require('gulp-concat');
var gulp = require('gulp');
var uglify = require('gulp-uglify');

// Concatenate and minify javascripts.
gulp.task('scripts', function() {
	return gulp.src(paths.scripts)

	.pipe(sourcemaps.init())


		.pipe(uglify({
			mangle: false
		}))

		.pipe(concat('scripts.js'))


	.pipe(sourcemaps.write())


	.pipe(gulp.dest('assets/js'));
});