module.exports = {
	...require( '@wordpress/prettier-config' ),
	overrides: [
		{
			files: '*.scss',
			options: {
				singleQuote: true,
			},
		},
	],
};
