const browserSync = require( 'browser-sync' );
const gulp = require( 'gulp' );
const webpack = require( 'webpack' );
const webpackDevMiddleware = require( 'webpack-dev-middleware' );
const webpackHotMiddleware = require( 'webpack-hot-middleware' );

const webpackConfig = require( '../webpack.config' );
const bundle = webpack( webpackConfig );
const paths = require( './config' ).paths;

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
		'proxy': 'http://hacker.local', // Use https://_s.test:3000 to use BrowserSync.
		middleware: [
			webpackDevMiddleware( bundle, {
				publicPath: 'http://localhost:3000/wp-content/themes/wd_s/assets/scripts/'
			} ),
			webpackHotMiddleware( bundle, {} )
		]
	} );

	// Run tasks when files change.
	gulp.watch( paths.icons, [ 'icons' ] );
	gulp.watch( paths.sass, [ 'styles' ] );
	gulp.watch( paths.sprites, [ 'sprites' ] );
	gulp.watch( paths.php, [ 'markup' ] );
	gulp.watch( paths.js, [ 'scripts' ] );
} );