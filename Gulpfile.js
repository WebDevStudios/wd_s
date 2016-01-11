var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var del = require('del');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var neat = require('node-neat').includePaths;
var reload = browserSync.reload;
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var spritesmith = require('gulp.spritesmith');
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');
var uglify = require('gulp-uglify');


// Set assets paths.
var paths = {
	icons: 'assets/images/svg-icons/*.svg',
	images: ['assets/images/*', '!assets/images/*.svg'],
	scripts: 'assets/js/concat/*.js',
	sprites: 'assets/images/sprites/*.png',
	sass: 'assets/sass/**/*.scss'
};

// Clean files.
gulp.task('clean', function() {
	return del(['build']);
});

// Minify SVG files.
gulp.task('svgmin', function() {
	return gulp.src(paths.icons)
	.pipe(svgmin({ plugins: [
		{ removeComments: true },
		{ removeEmptyAttrs: true },
		{ removeUselessStrokeAndFill: true }
	]}))
	.pipe(gulp.dest('assets/images/svg-icons/'));
});

// Concatenate icons in a single SVG sprite.
gulp.task('icons', ['clean'], function() {
	return gulp.src(paths.icons)
	.pipe(svgstore())
	.pipe(gulp.dest('assets/images/'));
});

// Concatenate images into a single PNG sprite.
gulp.task('sprites', ['clean'], function() {
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
gulp.task('sass', ['clean'], function() {
	return gulp.src('assets/sass/*.scss')
	.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: neat,
			outputStyle: 'expanded'
		}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./'));
});

// Minify stylesheet
gulp.task('css', ['clean'], function() {
	return gulp.src('style.css')
	.pipe(sourcemaps.init())
		.pipe(cssnano({
			safe: true
		}))
		.pipe(rename('style.min.css'))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./'));
});

// Concatenate and minify javascripts.
gulp.task('scripts', ['clean'], function() {
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

// Reload browsers on file changes.
gulp.task('browser-sync', function() {
	browserSync.init({
		proxy: "_s.dev"
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

// Default "gulp" task.
gulp.task('default', ['svgmin', 'icons', 'images', 'sprites', 'sass', 'css', 'scripts']);