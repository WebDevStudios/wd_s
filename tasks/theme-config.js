/**
 * Theme Configuration.
 */
module.exports = {
	localURL: 'https://hacker.local',
	paths: {
		'css': [ './*.css', '!*.min.css' ],
		'icons': 'assets/images/svg-icons/*.svg',
		'images': [ 'assets/images/*', '!assets/images/*.svg' ],
		'php': [ './*.php', './**/*.php' ],
		'js': 'assets/scripts/src/**/*.js',
		'sass': 'assets/sass/**/*.scss',
		'sprites': 'assets/images/sprites/*.png'
	},
	themeName: 'wd_s',
	watchURL: 'https://localhost:3000'
};