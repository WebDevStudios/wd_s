const gulp = require( 'gulp' );
const phpcs = require( 'gulp-phpcs' );

/**
 * Run PHPCS on .php files.
 */
gulp.task( 'phpcs', function() {

	return gulp.src( [ '**/*.php', '!vendor/**/*.*' ] )
		.pipe( phpcs( {
			standard: 'WebDevStudios',
			warningSeverity: 0
		} ) )
		.pipe( phpcs.reporter( 'log' ) );
} );
