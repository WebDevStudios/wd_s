// Require our dependencies
var autoprefixer = require('autoprefixer');
var bourbon = require('bourbon').includePaths;
var browserSync = require('browser-sync');
var cheerio = require('gulp-cheerio');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var del = require('del');
var gulp = require('gulp');
var gutil = require('gulp-util');
var imagemin = require('gulp-imagemin');
var mqpacker = require('css-mqpacker');
var neat = require('bourbon-neat').includePaths;
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var reload = browserSync.reload;
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sassLint = require('gulp-sass-lint');
var sort = require('gulp-sort');
var sourcemaps = require('gulp-sourcemaps');
var spritesmith = require('gulp.spritesmith');
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');
var uglify = require('gulp-uglify');
var wpPot = require('gulp-wp-pot');

// Set assets paths.
var paths = {
	css: ['./*.css', '!*.min.css'],
	icons: 'assets/images/svg-icons/*.svg',
	images: ['assets/images/*', '!assets/images/*.svg'],
	php: ['./*.php', './**/*.php'],
	sass: 'assets/sass/**/*.scss',
	concat_scripts: 'assets/js/concat/*.js',
	scripts: ['assets/js/*.js', '!assets/js/*.min.js', '!assets/js/customizer.js'],
	sprites: 'assets/images/sprites/*.png'
};

/**
 * Handle errors and alert the user.
 */
function handleErrors () {
	var args = Array.prototype.slice.call(arguments);

	notify.onError({
		title: 'Task Failed [<%= error.message %>',
		message: 'See console.',
		sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
	}).apply(this, args);

	gutil.beep(); // Beep 'sosumi' again

	// Prevent the 'watch' task from stopping
	this.emit('end');
}

/**
 * Delete style.css and style.min.css before we minify and optimize
 */
gulp.task('clean:styles', function() {
	return del(['style.css', 'style.min.css'])
});

/**
 * Compile Sass and run stylesheet through PostCSS.
 *
 * https://www.npmjs.com/package/gulp-sass
 * https://www.npmjs.com/package/gulp-postcss
 * https://www.npmjs.com/package/gulp-autoprefixer
 * https://www.npmjs.com/package/css-mqpacker
 */
gulp.task('postcss', ['clean:styles'], function() {
	return gulp.src('assets/sass/*.scss', paths.css)

	// Deal with errors.
	.pipe(plumber({ errorHandler: handleErrors }))

	// Wrap tasks in a sourcemap.
	.pipe(sourcemaps.init())

		// Compile Sass using LibSass.
		.pipe(sass({
			includePaths: [].concat(bourbon, neat),
			errLogToConsole: true,
			outputStyle: 'expanded' // Options: nested, expanded, compact, compressed
		}))

		// Parse with PostCSS plugins.
		.pipe(postcss([
			autoprefixer({
				browsers: ['last 2 version']
			}),
			mqpacker({
				sort: true
			}),
		]))

	// Create sourcemap.
	.pipe(sourcemaps.write())

	// Create style.css.
	.pipe(gulp.dest('./'))
	.pipe(browserSync.stream());
});

/**
 * Minify and optimize style.css.
 *
 * https://www.npmjs.com/package/gulp-cssnano
 */
gulp.task('cssnano', ['postcss'], function() {
	return gulp.src('style.css')
	.pipe(plumber({ errorHandler: handleErrors }))
	.pipe(cssnano({
		safe: true // Use safe optimizations
	}))
	.pipe(rename('style.min.css'))
	.pipe(gulp.dest('./'))
	.pipe(browserSync.stream());
});

/**
 * Sass linting.
 *
 * https://www.npmjs.com/package/sass-lint
 */
gulp.task('sass:lint', ['cssnano'], function() {
	gulp.src([
		'assets/sass/**/*.scss',
		'!assets/sass/base/_normalize.scss',
		'!assets/sass/utilities/animate/**/*.*',
		'!assets/sass/base/_sprites.scss'
	])
	.pipe(sassLint())
	.pipe(sassLint.format())
	.pipe(sassLint.failOnError());
});

/**
 * Delete the svg-icons.svg before we minify, concat.
 */
gulp.task('clean:icons', function() {
	return del(['assets/images/svg-icons.svg']);
});

/**
 * Minify, concatenate, and clean SVG icons.
 *
 * https://www.npmjs.com/package/gulp-svgmin
 * https://www.npmjs.com/package/gulp-svgstore
 * https://www.npmjs.com/package/gulp-cheerio
 */
gulp.task('svg', ['clean:icons'], function() {
	return gulp.src(paths.icons)
	.pipe(plumber({ errorHandler: handleErrors }))
	.pipe(svgmin())
	.pipe(rename({ prefix: 'icon-' }))
	.pipe(svgstore({ inlineSvg: true }))
	.pipe(cheerio({
		run: function($, file) {
			$('svg').attr('style', 'display:none');
			$('[fill]').removeAttr('fill');
		},
		parserOptions: { xmlMode: true }
	}))
	.pipe(gulp.dest('assets/images/'))
	.pipe(browserSync.stream());
});

/**
 * Optimize images.
 *
 * https://www.npmjs.com/package/gulp-imagemin
 */
gulp.task('imagemin', function() {
	return gulp.src(paths.images)
	.pipe(plumber({ errorHandler: handleErrors }))
	.pipe(imagemin({
		optimizationLevel: 5,
		progressive: true,
		interlaced: true
	}))
	.pipe(gulp.dest('assets/images'));
});

/**
 * Delete the sprites.png before rebuilding sprite.
 */
gulp.task('clean:sprites', function() {
	return del(['assets/images/sprites.png']);
});

/**
 * Concatenate images into a single PNG sprite.
 *
 * https://www.npmjs.com/package/gulp.spritesmith
 */
gulp.task('spritesmith', ['clean:sprites'], function() {
	return gulp.src(paths.sprites)
	.pipe(plumber({ errorHandler: handleErrors }))
	.pipe(spritesmith({
		imgName:   'sprites.png',
		cssName:   '../../assets/sass/base/_sprites.scss',
		imgPath:   'assets/images/sprites.png',
		algorithm: 'binary-tree'
	}))
	.pipe(gulp.dest('assets/images/'))
	.pipe(browserSync.stream());
});

/**
 * Concatenate javascripts after they're clobbered.
 * https://www.npmjs.com/package/gulp-concat
 */
gulp.task('concat', function() {
	return gulp.src(paths.concat_scripts)
	.pipe(plumber({ errorHandler: handleErrors }))
	.pipe(sourcemaps.init())
	.pipe(concat('project.js'))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('assets/js'))
	.pipe(browserSync.stream());
});

 /**
  * Minify javascripts after they're concatenated.
  * https://www.npmjs.com/package/gulp-uglify
  */
gulp.task('uglify', ['concat'], function() {
	return gulp.src(paths.scripts)
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify({
		mangle: false
	}))
	.pipe(gulp.dest('assets/js'));
});

/**
 * Delete the theme's .pot before we create a new one.
 */
gulp.task('clean:pot', function() {
	return del(['languages/_s.pot']);
});

/**
 * Scan the theme and create a POT file.
 *
 * https://www.npmjs.com/package/gulp-wp-pot
 */
gulp.task('wp-pot', ['clean:pot'], function() {
	return gulp.src(paths.php)
	.pipe(plumber({ errorHandler: handleErrors }))
	.pipe(sort())
	.pipe(wpPot({
		domain: '_s',
		destFile:'_s.pot',
		package: '_s',
		bugReport: 'http://_s.com',
		lastTranslator: 'John Doe <mail@_s.com>',
		team: 'Team <mail@_s.com>'
	}))
	.pipe(gulp.dest('languages/'));
});

/**
 * Process tasks and reload browsers on file changes.
 *
 * https://www.npmjs.com/package/browser-sync
 */
gulp.task('watch', function() {

	// Kick off BrowserSync.
	browserSync({
		open: false,             // Open project in a new tab?
		injectChanges: true,     // Auto inject changes instead of full reload
		proxy: "testing.dev",         // Use http://_s.com:3000 to use BrowserSync
		watchOptions: {
			debounceDelay: 1000  // Wait 1 second before injecting
		}
	});

	// Run tasks when files change.
	gulp.watch(paths.icons, ['icons']);
	gulp.watch(paths.sass, ['styles']);
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.concat_scripts, ['scripts']);
	gulp.watch(paths.sprites, ['sprites']);
});

/**
 * Create individual tasks.
 */
gulp.task('i18n', ['wp-pot']);
gulp.task('icons', ['svg']);
gulp.task('scripts', ['uglify']);
gulp.task('styles', ['cssnano']);
gulp.task('sprites', ['spritesmith']);
gulp.task('default', ['sprites', 'i18n', 'icons', 'styles', 'scripts', 'imagemin']);