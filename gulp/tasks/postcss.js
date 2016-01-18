// Require our dependencies
var autoprefixer = require('autoprefixer');
var gulp = require('gulp');
var mqpacker = require('css-mqpacker');
var neat = require('node-neat').includePaths;
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

// Compile Sass and run stylesheet through PostCSS.
gulp.task('postcss', function() {
	return gulp.src('assets/sass/*.scss', paths.css)

	// Wrap tasks in a sourcemap.
	.pipe(sourcemaps.init())

		// Compile Sass using LibSass.
		.pipe(sass({
			includePaths: neat, // Include Bourbon & Neat
			outputStyle: 'expanded' // Options: nested, expanded, compact, compressed
		}))

		// Parse with PostCSS plugins.
		.pipe(postcss([
			autoprefixer({
				browsers: ['last 2 version'] // Parse CSS and add vendor prefixes.
			}),
			mqpacker({
				sort: true // Pack the same CSS media query rules into one rule.
			}),
		]))

	// Create sourcemap.
	.pipe(sourcemaps.write())

	// Create style.css.
	.pipe(gulp.dest('./'))
});