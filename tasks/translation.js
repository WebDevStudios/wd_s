const del = require( 'del' );
const gulp = require( 'gulp' );
const plumber = require( 'gulp-plumber' );
const wpPot = require( 'gulp-wp-pot' );
const sort = require( 'gulp-sort' );

const config = require( './config' );
const handleErrors = require( './handle-errors' );

/**
 * Delete the theme's .pot before we create a new one.
 */
gulp.task( 'clean:pot', () =>
	del( [ 'languages/_s.pot' ] )
);

/**
 * Scan the theme and create a POT file.
 *
 * https://www.npmjs.com/package/gulp-wp-pot
 */
gulp.task( 'wp-pot', [ 'clean:pot' ], () =>
	gulp.src( config.paths.php )
		.pipe( plumber( {'errorHandler': handleErrors} ) )
		.pipe( sort() )
		.pipe( wpPot( {
			'domain': '_s',
			'package': '_s'
		} ) )
		.pipe( gulp.dest( 'languages/_s.pot' ) )
);