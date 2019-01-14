/* eslint-disable */

// Require our dependencies
const gulp = require( 'gulp' );

// Tasks for compiling, linting, and documenting styles.
require( './tasks/styles' );

// Tasks for SVG icons.
require( './tasks/icons' );

// Tasks for optimizing images and creating sprites.
require( './tasks/images' );

// Tasks for creating POT files.
require( './tasks/translation' );

// Tasks for watching files and reloading.
require( './tasks/watch' );

// Tasks for bundling JavaScript.
require( './tasks/scripts' );

/**
 * Default Gulp task.
 */
gulp.task( 'default', [ 'sprites', 'i18n', 'icons', 'styles', 'imagemin' ] );
