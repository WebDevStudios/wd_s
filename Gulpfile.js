// Require our dependencies
const autoprefixer = require( 'autoprefixer' ),
	babel = require( 'gulp-babel' ),
	browserSync = require( 'browser-sync' ),
	cheerio = require( 'gulp-cheerio' ),
	concat = require( 'gulp-concat' ),
	cssnano = require( 'gulp-cssnano' ),
	del = require( 'del' ),
	gulp = require( 'gulp' ),
	gutil = require( 'gulp-util' ),
	imagemin = require( 'gulp-imagemin' ),
	mqpacker = require( 'css-mqpacker' ),
	notify = require( 'gulp-notify' ),
	plumber = require( 'gulp-plumber' ),
	postcss = require( 'gulp-postcss' ),
	reload = browserSync.reload,
	rename = require( 'gulp-rename' ),
	sass = require( 'gulp-sass' ),
	sort = require( 'gulp-sort' ),
	sourcemaps = require( 'gulp-sourcemaps' ),
	spritesmith = require( 'gulp.spritesmith' ),
	svgmin = require( 'gulp-svgmin' ),
	svgstore = require( 'gulp-svgstore' ),
	uglify = require( 'gulp-uglify' ),
	wpPot = require( 'gulp-wp-pot' ),

	// Set asset paths.
	paths = {
		'concat_scripts': 'assets/scripts/concat/*.js',
		'css': [ './*.css', '!*.min.css' ],
		'foundationJS': 'node_modules/foundation-sites/js/',
		'icons': 'assets/images/svg-icons/*.svg',
		'images': [ 'assets/images/*', '!assets/images/*.svg' ],
		'php': [ './*.php', './**/*.php' ],
		'sass': 'assets/sass/**/*.scss',
		'scripts': [ 'assets/scripts/*.js', '!assets/scripts/*.min.js', '!assets/scripts/customizer.js' ],
		'sprites': 'assets/images/sprites/*.png'
	},

	// Set theme Javascript directories.
	themeJavascriptDir = [

		// Required Foundation components.
		paths.foundationJS + 'foundation.core.js',
		paths.foundationJS + 'foundation.util.mediaQuery.js',

		// Optional Foundation components.
		// To disable, just comment them out.
		paths.foundationJS + 'foundation.abide.js',
		paths.foundationJS + 'foundation.accordion.js',
		paths.foundationJS + 'foundation.accordionMenu.js',
		paths.foundationJS + 'foundation.drilldown.js',
		paths.foundationJS + 'foundation.dropdown.js',
		paths.foundationJS + 'foundation.dropdownMenu.js',
		paths.foundationJS + 'foundation.equalizer.js',
		paths.foundationJS + 'foundation.interchange.js',
		paths.foundationJS + 'foundation.magellan.js',
		paths.foundationJS + 'foundation.offcanvas.js',
		paths.foundationJS + 'foundation.orbit.js',
		paths.foundationJS + 'foundation.responsiveMenu.js',
		paths.foundationJS + 'foundation.responsiveToggle.js',
		paths.foundationJS + 'foundation.reveal.js',
		paths.foundationJS + 'foundation.slider.js',
		paths.foundationJS + 'foundation.sticky.js',
		paths.foundationJS + 'foundation.tabs.js',
		paths.foundationJS + 'foundation.toggler.js',
		paths.foundationJS + 'foundation.tooltip.js',
		paths.foundationJS + 'foundation.util.box.js',
		paths.foundationJS + 'foundation.util.keyboard.js',
		paths.foundationJS + 'foundation.util.motion.js',
		paths.foundationJS + 'foundation.util.nest.js',
		paths.foundationJS + 'foundation.util.timerAndImageLoader.js',
		paths.foundationJS + 'foundation.util.touch.js',
		paths.foundationJS + 'foundation.util.triggers.js',
		paths.foundationJS + 'foundation.zf.responsiveAccordionTabs.js',

		// Required theme scripts.
		paths.concat_scripts
	];

/**
 * Handle errors and alert the user.
 */
function handleErrors() {
	const args = Array.prototype.slice.call( arguments );

	notify.onError({
		'title': 'Task Failed [<%= error.message %>',
		'message': 'See console.',
		'sound': 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
	}).apply( this, args );

	gutil.beep(); // Beep 'sosumi' again.

	// Prevent the 'watch' task from stopping.
	this.emit( 'end' );
}

/**
 * Delete style.css and style.min.css before we minify and optimize
 */
gulp.task( 'clean:styles', () =>
	del([ 'style.css', 'style.min.css' ])
);

/**
 * Compile Sass and run stylesheet through PostCSS.
 *
 * https://www.npmjs.com/package/gulp-sass
 * https://www.npmjs.com/package/gulp-postcss
 * https://www.npmjs.com/package/gulp-autoprefixer
 * https://www.npmjs.com/package/css-mqpacker
 */
gulp.task( 'postcss', [ 'clean:styles' ], () =>
	gulp.src( 'assets/sass/*.scss', paths.css )

		// Deal with errors.
		.pipe( plumber({'errorHandler': handleErrors}) )

		// Wrap tasks in a sourcemap.
		.pipe( sourcemaps.init() )

			// Compile Sass using LibSass.
			.pipe( sass({
				'errLogToConsole': true,
				'outputStyle': 'expanded' // Options: nested, expanded, compact, compressed
			}) )

			// Parse with PostCSS plugins.
			.pipe( postcss([
				autoprefixer({
					'browsers': [ 'last 2 versions' ]
				}),
				mqpacker({
					'sort': true
				})
			]) )

		// Create sourcemap.
		.pipe( sourcemaps.write() )

		// Create style.css.
		.pipe( gulp.dest( './' ) )
		.pipe( browserSync.stream() )
);

/**
 * Minify and optimize style.css.
 *
 * https://www.npmjs.com/package/gulp-cssnano
 */
gulp.task( 'cssnano', [ 'postcss' ], () =>
	gulp.src( 'style.css' )
		.pipe( plumber({'errorHandler': handleErrors}) )
		.pipe( cssnano({
			'safe': true // Use safe optimizations.
		}) )
		.pipe( rename( 'style.min.css' ) )
		.pipe( gulp.dest( './' ) )
		.pipe( browserSync.stream() )
);

/**
 * Delete the svg-icons.svg before we minify, concat.
 */
gulp.task( 'clean:icons', () =>
	del([ 'assets/images/svg-icons.svg' ])
);

/**
 * Minify, concatenate, and clean SVG icons.
 *
 * https://www.npmjs.com/package/gulp-svgmin
 * https://www.npmjs.com/package/gulp-svgstore
 * https://www.npmjs.com/package/gulp-cheerio
 */
gulp.task( 'svg', [ 'clean:icons' ], () =>
	gulp.src( paths.icons )

		// Deal with errors.
		.pipe( plumber({'errorHandler': handleErrors}) )

		// Minify SVGs.
		.pipe( svgmin() )

		// Add a prefix to SVG IDs.
		.pipe( rename({'prefix': 'icon-'}) )

		// Combine all SVGs into a single <symbol>
		.pipe( svgstore({'inlineSvg': true}) )

		// Clean up the <symbol> by removing the following cruft...
		.pipe( cheerio({
			'run': function( $, file ) {
				$( 'svg' ).attr( 'style', 'display:none' );
				$( '[fill]' ).removeAttr( 'fill' );
				$( 'path' ).removeAttr( 'class' );
			},
			'parserOptions': {'xmlMode': true}
		}) )

		// Save svg-icons.svg.
		.pipe( gulp.dest( 'assets/images/' ) )
		.pipe( browserSync.stream() )
);

/**
 * Optimize images.
 *
 * https://www.npmjs.com/package/gulp-imagemin
 */
gulp.task( 'imagemin', () =>
	gulp.src( paths.images )
		.pipe( plumber({'errorHandler': handleErrors}) )
		.pipe( imagemin({
			'optimizationLevel': 5,
			'progressive': true,
			'interlaced': true
		}) )
		.pipe( gulp.dest( 'assets/images' ) )
);

/**
 * Delete the sprites.png before rebuilding sprite.
 */
gulp.task( 'clean:sprites', () => {
	del([ 'assets/images/sprites.png' ]);
});

/**
 * Concatenate images into a single PNG sprite.
 *
 * https://www.npmjs.com/package/gulp.spritesmith
 */
gulp.task( 'spritesmith', [ 'clean:sprites' ], () =>
	gulp.src( paths.sprites )
		.pipe( plumber({'errorHandler': handleErrors}) )
		.pipe( spritesmith({
			'imgName': 'sprites.png',
			'cssName': '../../assets/sass/base/_sprites.scss',
			'imgPath': 'assets/images/sprites.png',
			'algorithm': 'binary-tree'
		}) )
		.pipe( gulp.dest( 'assets/images/' ) )
		.pipe( browserSync.stream() )
);

/**
 * Concatenate and transform JavaScript.
 *
 * https://www.npmjs.com/package/gulp-concat
 * https://github.com/babel/gulp-babel
 * https://www.npmjs.com/package/gulp-sourcemaps
 */
gulp.task( 'concat', () =>
	gulp.src( themeJavascriptDir )

		// Deal with errors.
		.pipe( plumber(
			{'errorHandler': handleErrors}
		) )

		// Start a sourcemap.
		.pipe( sourcemaps.init() )

		// Convert ES6+ to ES2015.
		.pipe( babel({
			presets: [ 'es2015' ]
		}) )

		// Concatenate partials into a single script.
		.pipe( concat( 'project.js' ) )

		// Append the sourcemap to project.js.
		.pipe( sourcemaps.write() )

		// Save project.js
		.pipe( gulp.dest( 'assets/scripts' ) )
		.pipe( browserSync.stream() )
);

/**
  * Minify compiled JavaScript.
  *
  * https://www.npmjs.com/package/gulp-uglify
  */
gulp.task( 'uglify', [ 'concat' ], () =>
	gulp.src( paths.scripts )
		.pipe( rename({'suffix': '.min'}) )
		.pipe( uglify({
			'mangle': false
		}) )
		.pipe( gulp.dest( 'assets/scripts' ) )
);

/**
 * Delete the theme's .pot before we create a new one.
 */
gulp.task( 'clean:pot', () =>
	del([ 'languages/_s.pot' ])
);

/**
 * Scan the theme and create a POT file.
 *
 * https://www.npmjs.com/package/gulp-wp-pot
 */
gulp.task( 'wp-pot', [ 'clean:pot' ], () =>
	gulp.src( paths.php )
		.pipe( plumber({'errorHandler': handleErrors}) )
		.pipe( sort() )
		.pipe( wpPot({
			'domain': '_s',
			'package': '_s'
		}) )
		.pipe( gulp.dest( 'languages/_s.pot' ) )
);


/**
 * Process tasks and reload browsers on file changes.
 *
 * https://www.npmjs.com/package/browser-sync
 */
gulp.task( 'watch', function() {

	// Kick off BrowserSync.
	browserSync({
		'open': false,             // Open project in a new tab?
		'injectChanges': true,     // Auto inject changes instead of full reload.
		'proxy': 'testing.dev',    // Use http://_s.com:3000 to use BrowserSync.
		'watchOptions': {
			'debounceDelay': 1000  // Wait 1 second before injecting.
		}
	});

	// Run tasks when files change.
	gulp.watch( paths.icons, [ 'icons' ]);
	gulp.watch( paths.sass, [ 'styles' ]);
	gulp.watch( paths.scripts, [ 'scripts' ]);
	gulp.watch( paths.concat_scripts, [ 'scripts' ]);
	gulp.watch( paths.sprites, [ 'sprites' ]);
	gulp.watch( paths.php, [ 'markup' ]);
});

/**
 * Create individual tasks.
 */
gulp.task( 'markup', browserSync.reload );
gulp.task( 'i18n', [ 'wp-pot' ]);
gulp.task( 'icons', [ 'svg' ]);
gulp.task( 'scripts', [ 'uglify' ]);
gulp.task( 'styles', [ 'cssnano' ]);
gulp.task( 'sprites', [ 'spritesmith' ]);
gulp.task( 'lint', [ 'sass:lint', 'js:lint' ]);
gulp.task( 'default', [ 'sprites', 'i18n', 'icons', 'styles', 'scripts', 'imagemin' ]);
