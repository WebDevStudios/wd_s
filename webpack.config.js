/**
 * Webpack Config
 *
 * @package wd_s
 */

module.exports = {
	mode: 'development',
	output: {
		filename: 'project.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/preset-env' ]
					}
				}
			}
		]
	}
};
