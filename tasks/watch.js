const browserSync = require( 'browser-sync' );
const gulp = require( 'gulp' );
const webpack = require( 'webpack' );
const webpackDevMiddleware = require( 'webpack-dev-middleware' );
const webpackHotMiddleware = require( 'webpack-hot-middleware' );

const webpackConfig = require( '../webpack.config' );
const bundle = webpack( webpackConfig );
const themeConfig = require('./theme-config' );

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
		'proxy': themeConfig.localURL, // Use https://_s.test:3000 to use BrowserSync.
		middleware: [
			webpackDevMiddleware( bundle, {
				publicPath: 'https://localhost:3000/wp-content/themes/' + themeConfig.themeName + '/assets/scripts/'
			} ),
			webpackHotMiddleware( bundle, {} )
		]
	} );

	// Run tasks when files change.
	gulp.watch( themeConfig.paths.icons, [ 'icons' ] );
	gulp.watch( themeConfig.paths.sass, [ 'styles' ] );
	gulp.watch( themeConfig.paths.sprites, [ 'sprites' ] );
	gulp.watch( themeConfig.paths.php, [ 'markup' ] );
	gulp.watch( themeConfig.paths.js, [ 'scripts' ] );
} );