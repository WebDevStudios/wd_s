const eslint = require( 'gulp-eslint' );
const gulp = require( 'gulp' );
const webpack = require( 'webpack' );
const webpackStream = require( 'webpack-stream' );

const webpackConfig = require( '../webpack.config' );
const themeConfig = require( './theme-config' );

/**
 * Let Webpack transpile the JavaScript.
 */
gulp.task( 'scripts', function() {
	gulp.src( [ themeConfig.paths.js, themeConfig.paths.customizer, themeConfig.paths.scaffolding ] )
		.pipe( webpackStream( webpackConfig ), webpack )
		.pipe( gulp.dest( './assets/scripts' ) );
} );

/**
 * JavaScript linting.
 *
 * https://www.npmjs.com/package/gulp-eslint
 */
gulp.task( 'js:lint', () =>
	gulp.src( [
		'assets/scripts/customizer/**/*.js',
		'assets/scripts/scaffolding/**/*.js',
		'assets/scripts/src/**/*.js',
		'!assets/scripts/project.js',
		'!assets/scripts/*.min.js',
		'!Gruntfile.js',
		'!Gulpfile.js',
		'!webpack.config.js',
		'!node_modules/**'
	] )
		.pipe( eslint() )
		.pipe( eslint.format() )
		.pipe( eslint.failAfterError() )
);
