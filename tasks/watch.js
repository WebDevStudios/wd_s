const browserSync = require( 'browser-sync' );
const gulp = require( 'gulp' );

const themeConfig = require( './theme-config' );

/**
 * Process tasks and reload browsers on file changes.
 *
 * https://www.npmjs.com/package/browser-sync
 */
gulp.task( 'watch-files', function() {

	// Kick off BrowserSync.
	browserSync( {
		'open': false, // Open project in a new tab?
		'injectChanges': true,  // Auto inject changes instead of full reload.
		'proxy': themeConfig.localURL // Use https://localhost.test:3000 to use BrowserSync.
	} );

	// Run tasks when files change.
	gulp.watch( themeConfig.paths.icons, [ 'icons' ] );
	gulp.watch( themeConfig.paths.sass, [ 'sass:lint', 'styles' ] );
	gulp.watch( themeConfig.paths.php, [ 'markup' ] );
	gulp.watch( themeConfig.paths.js, [ 'js:lint', 'scripts' ] );
	gulp.watch( themeConfig.paths.js ).on( 'change', browserSync.reload );
} );
