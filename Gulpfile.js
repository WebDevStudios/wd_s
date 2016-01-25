// Require our dependencies
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var del = require('del');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var mqpacker = require('css-mqpacker');
var neat = require('node-neat').includePaths;
var postcss = require('gulp-postcss');
var reload = browserSync.reload;
var rename = require('gulp-rename');
var sass = require('gulp-sass');
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
	scripts: 'assets/js/concat/*.js',
	sprites: 'assets/images/sprites/*.png',
	sass: 'assets/sass/**/*.scss'
};


// Minify SVG files.
gulp.task('svgmin', function() {
	return gulp.src(paths.icons)
	.pipe(svgmin({ plugins: [
		{ removeDoctype: true },
		{ removeComments: true },
		{ removeEmptyAttrs: true },
		{ removeUselessStrokeAndFill: true }
	]}))
	.pipe(gulp.dest('assets/images/svg-icons/'));
});


// Concatenate icons in a single SVG sprite.
gulp.task('icons', function() {
	return gulp.src(paths.icons)
	.pipe(svgstore( { plugins: [
		{ inlineSVG: true }
	]}))
	.pipe(gulp.dest('assets/images/'));
});


// Concatenate images into a single PNG sprite.
gulp.task('sprites', function() {
	return gulp.src(paths.sprites)
	.pipe(spritesmith({
		imgName:   'sprites.png',
		cssName:   '../../assets/sass/base/_sprites.scss',
		imgPath:   'assets/images/sprites.png',
		algorithm: 'binary-tree'
	}))
	.pipe(gulp.dest('assets/images/'));
});


// Compile Sass and create stylesheet.
gulp.task('sass', function() {
	return gulp.src('assets/sass/*.scss')
	.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: neat,
			outputStyle: 'expanded'
		}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./'));
});


// Compile Sass and run stylesheet through PostCSS.
gulp.task('postcss', function() {
	return gulp.src('assets/sass/*.scss', paths.css)

	// Wrap tasks in a sourcemap.
	.pipe(sourcemaps.init())

		// Compile Sass using LibSass.
		.pipe(sass({
			includePaths: neat, // Include Bourbon & Neat
			outputStyle: 'expanded' // Options: nested, expanded, compact, compressed
		}))

		// Parse with PostCSS plugins.
		.pipe(postcss([
			autoprefixer({
				browsers: ['last 2 version'] // Parse CSS and add vendor prefixes.
			}),
			mqpacker({
				sort: true // Pack the same CSS media query rules into one rule.
			}),
		]))

	// Create sourcemap.
	.pipe(sourcemaps.write())

	// Create style.css.
	.pipe(gulp.dest('./'))
});


// Minify and optimize style.css.
gulp.task('cssnano', function() {
	return gulp.src('style.min.css')

	.pipe(sourcemaps.init({
		loadMaps: true // Use the existing sourcemap.
	}))
		.pipe(cssnano({
			safe: true // Use safe optimizations
		}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./'));
});


// Concatenate and minify javascripts.
gulp.task('scripts', function() {
	return gulp.src(paths.scripts)
	.pipe(sourcemaps.init())
		.pipe(uglify({
			mangle: false
		}))
		.pipe(concat('scripts.js'))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('assets/js'));
});


// Optimize images.
gulp.task('images', function() {
	return gulp.src(paths.images)
	.pipe(imagemin({
		optimizationLevel: 5
	}))
	.pipe(gulp.dest('assets/images'));
});


// Make POT file.
// https://www.npmjs.com/package/gulp-wp-pot
gulp.task('wp-pot', function () {
	return gulp.src('*.php')
		.pipe(sort())
		.pipe(wpPot( {
			domain: 'testing.dev',
			destFile:'_s.pot',
		} ))
		.pipe(gulp.dest('languages/'));
});


// Reload browsers on file changes.
gulp.task('browsersync', function() {
	browserSync.init({
		proxy: "testing.dev"
	});
	gulp.watch(['*.css', 'assets/js/*.js', 'assets/images/*']).on('change', reload);
});

// Rerun the task when a file changes.
gulp.task('watch', function() {
	gulp.watch(paths.icons, ['svgmin','icons']);
	gulp.watch(paths.sprites, ['sprites']);
	gulp.watch(paths.sass, ['sass', 'css']);
	gulp.watch(paths.scripts, ['scripts']);
});

// Deal with all the CSS tasks.
gulp.task('styles', ['postcss', 'cssnano']);

// Default "gulp" task.
gulp.task('default', ['svgmin', 'icons', 'images', 'sprites', 'sass', 'css', 'scripts']);