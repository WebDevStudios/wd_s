const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const ImageminPlugin = require( 'imagemin-webpack-plugin' ).default;
const { mode } = defaultConfig;

module.exports = {
	...defaultConfig,
	plugins: [
		...defaultConfig.plugins,

		new CopyWebpackPlugin( {
			patterns: [
				{
					from: '**/*.{jpg,jpeg,png,gif,svg}',
					to: 'images/[path][name].[ext]',
					context: path.resolve( process.cwd(), 'src/images' ),
				},
			],
		} ),

		new ImageminPlugin( {
			disable: 'production' !== mode,
			test: /\.(jpe?g|png|gif|svg)$/i,
			svgo: {
				plugins: [
					{ removeViewBox: false },
					{ removeDimensions: true },
					{
						removeAttrs: {
							attrs: '*:(stroke|fill):((?!^none$).)*',
						},
					},
				],
			},
		} ),
	],
};
