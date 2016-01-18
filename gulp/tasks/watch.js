// Require our dependencies
var gulp = require('gulp');

// Rerun the task when a file changes.
gulp.task('watch', function() {
	gulp.watch(paths.icons, ['svgmin','svgstore']);
	gulp.watch(paths.sprites, ['spritesmith']);
	gulp.watch(paths.sass, ['postcss', 'cssnano']);
	gulp.watch(paths.scripts, ['uglify']);
});
