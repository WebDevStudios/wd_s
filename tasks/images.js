const del = require( 'del' );
const gulp = require( 'gulp' );
const imagemin = require( 'gulp-imagemin' );
const plumber = require( 'gulp-plumber' );

const themeConfig = require( './theme-config' );
const handleErrors = require( './handle-errors' );

/**
 * Copy SVGs that shouldn't be processed.
 */
gulp.task( 'copy:svg', () => {
	gulp.src(['assets/src/images/svg/**/*.svg'])
		.pipe(gulp.dest('assets/dist/images/svg/'));
})

/**
 * Optimize images.
 *
 * https://www.npmjs.com/package/gulp-imagemin
 */
gulp.task( 'imagemin', [ 'copy:svg' ], () =>
	gulp.src( themeConfig.paths.images )
		.pipe( plumber( {'errorHandler': handleErrors} ) )
		.pipe( imagemin( {
			'optimizationLevel': 5,
			'progressive': true,
			'interlaced': true
		} ) )
		.pipe( gulp.dest( 'assets/dist/images/' ) )
);
