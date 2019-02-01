const autoprefixer = require( 'autoprefixer' );
const bourbon = require( 'bourbon' ).includePaths;
const browserSync = require( 'browser-sync' );
const cssnano = require( 'gulp-cssnano' );
const del = require( 'del' );
const gulp = require( 'gulp' );
const mqpacker = require( 'css-mqpacker' );
const neat = require( 'bourbon-neat' ).includePaths;
const plumber = require( 'gulp-plumber' );
const postcss = require( 'gulp-postcss' );
const rename = require( 'gulp-rename' );
const sass = require( 'gulp-sass' );
const sassdoc = require( 'sassdoc' );
const sassLint = require( 'gulp-sass-lint' );
const sourcemaps = require( 'gulp-sourcemaps' );

const themeConfig = require( './theme-config' );
const handleErrors = require( './handle-errors' );

/**
 * Compile Sass and run stylesheet through PostCSS.
 *
 * https://www.npmjs.com/package/gulp-sass
 * https://www.npmjs.com/package/gulp-postcss
 * https://www.npmjs.com/package/gulp-autoprefixer
 * https://www.npmjs.com/package/css-mqpacker
 */
gulp.task( 'postcss', () =>
	gulp.src( 'assets/sass/*.scss', themeConfig.paths.css )

	// Deal with errors.
		.pipe( plumber( {'errorHandler': handleErrors} ) )

		// Wrap tasks in a sourcemap.
		.pipe( sourcemaps.init() )

		// Compile Sass using LibSass.
		.pipe( sass( {
			'includePaths': [].concat( bourbon, neat ),
			'errLogToConsole': true,
			'outputStyle': 'expanded' // Options: nested, expanded, compact, compressed
		} ) )

		// Parse with PostCSS plugins.
		.pipe( postcss( [
			autoprefixer( {
				'browsers': [ 'last 2 version' ]
			} ),
			mqpacker( {
				'sort': true
			} )
		] ) )

		// Rename to main.css to prevent confusion with root style.css
		.pipe( rename( 'main.css') )

		// Create sourcemap.
		.pipe( sourcemaps.write() )

		// Create style.css.
		.pipe( gulp.dest( './assets/dist/css/' ) )
		.pipe( browserSync.stream() )
);

/**
 * Minify and optimize style.css.
 *
 * https://www.npmjs.com/package/gulp-cssnano
 */
gulp.task( 'cssnano', [ 'postcss' ], () =>
	gulp.src( 'assets/dist/css/main.css' )
		.pipe( plumber( {'errorHandler': handleErrors} ) )
		.pipe( cssnano( {
			'safe': true // Use safe optimizations.
		} ) )
		.pipe( rename( 'main.min.css' ) )
		.pipe( gulp.dest( './assets/dist/css/' ) )
		.pipe( browserSync.stream() )
);

/**
 * Sass linting.
 *
 * https://www.npmjs.com/package/sass-lint
 */
gulp.task( 'sass:lint', () =>
	gulp.src( [
		'assets/sass/**/*.scss',
		'!assets/sass/vendor/**/*.scss',
		'!node_modules/**'
	] )
		.pipe( sassLint() )
		.pipe( sassLint.format() )
		.pipe( sassLint.failOnError() )
);

/**
 * Sass docs.
 *
 * http://sassdoc.com/getting-started/
 */
gulp.task( 'sassdoc', function() {
	let options = {
		dest: 'docs',
		verbose: true
	};

	return gulp.src( 'assets/sass/**/*.scss' )
		.pipe( sassdoc( options ) );
} );
