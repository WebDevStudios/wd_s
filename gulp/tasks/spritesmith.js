// Require our dependencies
var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');

// Concatenate images into a single PNG sprite.
gulp.task('spritesmith', function() {
	return gulp.src(paths.sprites)
	.pipe(spritesmith({
		imgName:   'sprites.png',
		cssName:   '../../assets/sass/base/_sprites.scss',
		imgPath:   'assets/images/sprites.png',
		algorithm: 'binary-tree'
	}))
	.pipe(gulp.dest('assets/images/'));
});