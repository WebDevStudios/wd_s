/**
 * Webpack Config
 *
 * @package wd_s
 */
const webpack = require( 'webpack' );
const isProduction = 'production' === process.env.NODE_ENV;

const devEntry = {
	main: [
		'webpack/hot/dev-server',
		'webpack-hot-middleware/client?reload=true',
		'./assets/scripts/src/index.js'
	]
};

const prodEntry = {
	main: [ './assets/scripts/src/index.js' ]
};

const config = {
	mode: isProduction ? 'production' : 'development',
	entry: isProduction ? prodEntry : devEntry,
	output: {
		filename: isProduction ? 'project.min.js' : 'project.js',
		publicPath: 'http://localhost:3000/wp-content/themes/wd_s/assets/scripts/'
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
								"@babel/preset-env",
								{
									"targets": {
										"browsers": [ "last 2 versions" ]
									}
								}
							]
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
		jQuery: 'jQuery'
	}
};

if ( ! isProduction ) {
	config.plugins.push( new webpack.HotModuleReplacementPlugin() );
}

module.exports = config;
