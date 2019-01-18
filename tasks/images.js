const del = require( 'del' );
const gulp = require( 'gulp' );
const imagemin = require( 'gulp-imagemin' );
const plumber = require( 'gulp-plumber' );

const themeConfig = require( './theme-config' );
const handleErrors = require( './handle-errors' );

/**
 * Optimize images.
 *
 * https://www.npmjs.com/package/gulp-imagemin
 */
gulp.task( 'imagemin', () =>
	gulp.src( themeConfig.paths.images )
		.pipe( plumber( {'errorHandler': handleErrors} ) )
		.pipe( imagemin( {
			'optimizationLevel': 5,
			'progressive': true,
			'interlaced': true
		} ) )
		.pipe( gulp.dest( 'assets/images' ) )
);
