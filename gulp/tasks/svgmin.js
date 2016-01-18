// Require our dependencies
var gulp = require('gulp');
var svgmin = require('gulp-svgmin');

// Minify SVG files.
gulp.task('svgmin', function() {
	return gulp.src(paths.icons)
	.pipe(svgmin({ plugins: [
		{ removeDoctype: true },
		{ removeComments: true },
		{ removeEmptyAttrs: true },
		{ removeUselessStrokeAndFill: true }
	]}))
	.pipe(gulp.dest('assets/images/svg-icons/'));
});