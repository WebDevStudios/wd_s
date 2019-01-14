const browserSync = require( 'browser-sync' );
const del = require( 'del' );
const gulp = require( 'gulp' );
const imagemin = require( 'gulp-imagemin' );
const plumber = require( 'gulp-plumber' );
const spritesmith = require( 'gulp.spritesmith' );

const paths = require( './config' ).paths;
const handleErrors = require( './handle-errors' );

/**
 * Optimize images.
 *
 * https://www.npmjs.com/package/gulp-imagemin
 */
gulp.task( 'imagemin', () =>
	gulp.src( paths.images )
		.pipe( plumber( {'errorHandler': handleErrors} ) )
		.pipe( imagemin( {
			'optimizationLevel': 5,
			'progressive': true,
			'interlaced': true
		} ) )
		.pipe( gulp.dest( 'assets/images' ) )
);

/**
 * Delete the sprites.png before rebuilding sprite.
 */
gulp.task( 'clean:sprites', () => {
	del( [ 'assets/images/sprites.png' ] );
} );

/**
 * Concatenate images into a single PNG sprite.
 *
 * https://www.npmjs.com/package/gulp.spritesmith
 */
gulp.task( 'spritesmith', () =>
	gulp.src( paths.sprites )
		.pipe( plumber( {'errorHandler': handleErrors} ) )
		.pipe( spritesmith( {
			'imgName': 'sprites.png',
			'cssName': '../../assets/sass/base/_sprites.scss',
			'imgPath': 'assets/images/sprites.png',
			'algorithm': 'binary-tree'
		} ) )
		.pipe( gulp.dest( 'assets/images/' ) )
		.pipe( browserSync.stream() )
);