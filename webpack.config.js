/**
 * Webpack Config
 *
 * @package wd_s
 */
const themeConfig = require( './tasks/theme-config' );
const isProduction = 'production' === process.env.NODE_ENV;
const host = isProduction ? themeConfig.localURL : themeConfig.watchURL;

const config = {
	mode: isProduction ? 'production' : 'development',
	entry: {
		project: './assets/src/js/index.js',
		scaffolding: './assets/src/js/scaffolding.js',
		customizer: './assets/src/js/customizer.js'
	},
	output: {
		filename: isProduction ? '[name].min.js' : '[name].js',
		publicPath: host + '/wp-content/themes/' + themeConfig.themeName + '/assets/dist/js/'
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									'targets': {
										'browsers': [ 'last 2 versions' ]
									}
								}
							],
							'@babel/preset-react'
						]
					}
				}
			}
		]
	},
	plugins: [],
	devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',
	externals: {
		$: 'jQuery',
		jQuery: 'jQuery',
		jquery: 'jQuery'
	}
};

module.exports = config;
