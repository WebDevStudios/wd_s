// Require our dependencies
var gulp = require('gulp');
var svgstore = require('gulp-svgstore');

// Concatenate icons in a single SVG sprite.
gulp.task('svgstore', function() {
	return gulp.src(paths.icons)
	.pipe(svgstore( { plugins: [
		{ inlineSVG: true }
	]}))
	.pipe(gulp.dest('assets/images/'));
});