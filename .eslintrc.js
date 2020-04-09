module.exports = {
	extends: [
		'plugin:@wordpress/eslint-plugin/esnext',
		'plugin:@wordpress/eslint-plugin/react',
		'@webdevstudios/js-coding-standards',
	],
	root: true,
	env: {
		browser: true,
	},
};
