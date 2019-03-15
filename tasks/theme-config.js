/**
 * Theme Configuration.
 */
module.exports = {
	localURL: 'https://testing.test',
	paths: {
		'css': [ './*.css', '!*.min.css' ],
		'icons': 'assets/images/svg-icons/*.svg',
		'images': [ 'assets/images/*', '!assets/images/*.svg' ],
		'php': [ './*.php', './**/*.php' ],
		'js': 'assets/scripts/src/**/*.js',
		'customizer': 'assets/scripts/customizer/**/*.js',
		'scaffolding': 'assets/scripts/scaffolding/**/*.js',
		'sass': 'assets/sass/**/*.scss'
	},
	themeName: 'wd_s',
	watchURL: 'https://localhost:3000'
};
