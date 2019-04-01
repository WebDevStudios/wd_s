/**
 * Theme Configuration.
 */
module.exports = {
	localURL: 'https://testing.test',
	paths: {
		'css': [ './assets/dist/css/*.css', '!/assets/dist/css/*.min.css' ],
		'icons': 'assets/src/images/svg-icons/*.svg',
		'images': [ 'assets/src/images/**/*', '!assets/src/images/svg-icons/*' ],
		'php': [ './*.php', './**/*.php' ],
		'js': 'assets/src/js/src/**/*.js',
		'sass': 'assets/src/sass/**/*.scss'
	},
	themeName: 'wd_s',
	watchURL: 'https://localhost:3000'
};
