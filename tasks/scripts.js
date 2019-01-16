const gulp = require( 'gulp' );
const webpack = require( 'webpack' );
const webpackStream = require( 'webpack-stream' );

const webpackConfig = require( '../webpack.config' );

/**
 * Let Webpack transpile the JavaScript.
 */
gulp.task( 'scripts', function() {
	gulp.src( './assets/scripts/src/index.js' )
		.pipe( webpackStream( webpackConfig ), webpack )
		.pipe( gulp.dest( './assets/scripts' ) );
} );
