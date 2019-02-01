const babel = require( 'gulp-babel' );
const eslint = require( 'gulp-eslint' );
const gulp = require( 'gulp' );
const rename = require( 'gulp-rename' );
const uglify = require( 'gulp-uglify' );
const webpack = require( 'webpack' );
const webpackStream = require( 'webpack-stream' );

const webpackConfig = require( '../webpack.config' );

/**
 * Copy scripts that shouldn't be processed by Webpack
 */
gulp.task( 'copy:js', () => {
	gulp.src(['assets/src/js/*.js'])
	    .pipe(gulp.dest('assets/dist/js/'));
})

/**
 * Minify scripts that weren't be processed
 * by Webpack
 */
gulp.task( 'uglify:js', [ 'copy:js' ], () => {
	gulp.src(['assets/dist/js/*.js', '!assets/dist/js/project.js', '!assets/dist/js/*.min.js'])
	    .pipe( rename( {'suffix': '.min'} ) )
	    .pipe( babel( {
		    'presets': [
			    [ 'env', {
				    'targets': {
					    'browsers': [ 'last 2 versions' ]
				    }
			    } ]
		    ]
	    } ) )
	    .pipe( uglify( {
		    'mangle': false
	    } ) )
	    .pipe( gulp.dest( 'assets/dist/js/' ) )
})

/**
 * Let Webpack transpile the JavaScript.
 */
gulp.task( 'scripts', [ 'uglify:js' ], function() {
	gulp.src( './assets/src/js/src/index.js' )
		.pipe( webpackStream( webpackConfig ), webpack )
		.pipe( gulp.dest( './assets/dist/js/' ) );
} );

/**
 * JavaScript linting.
 *
 * https://www.npmjs.com/package/gulp-eslint
 */
gulp.task( 'js:lint', () =>
	gulp.src( [
		'assets/src/js/**/*.js',
		'!Gruntfile.js',
		'!Gulpfile.js',
		'!webpack.config.js',
		'!node_modules/**'
	] )
		.pipe( eslint() )
		.pipe( eslint.format() )
		.pipe( eslint.failAfterError() )
);
