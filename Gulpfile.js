/* eslint-disable */

// Require our dependencies
const gulp = require( 'gulp' );
const browserSync = require( 'browser-sync' );

// Tasks for compiling, linting, and documenting styles.
require( './tasks/styles' );

// Tasks for SVG icons.
require( './tasks/icons' );

// Tasks for optimizing images.
require( './tasks/images' );

// Tasks for creating POT files.
require( './tasks/translation' );

// Tasks for watching files and reloading.
require( './tasks/watch' );

// Tasks for bundling JavaScript.
require( './tasks/scripts' );

// Tasks for handling PHPCS.
require( './tasks/phpcs' );

/**
 * Individual Gulp tasks.
 */
gulp.task( 'markup', browserSync.reload );
gulp.task( 'icons', [ 'svg' ] );
gulp.task( 'js', [ 'scripts' ] );
gulp.task( 'styles', [ 'cssnano' ] );
gulp.task( 'lint', [ 'sass:lint' ] );
gulp.task( 'docs', [ 'sassdoc' ] );
gulp.task( 'i18n', [ 'wp-pot' ] );
gulp.task( 'watch', [ 'watch-files' ] );
gulp.task( 'default', [ 'i18n', 'icons', 'styles', 'js', 'imagemin' ] );
