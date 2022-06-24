module.exports = {
	plugins: {
		tailwindcss: {},
		'postcss-move-props-to-bg-image-query': {},
		'postcss-preset-env': {
			autoprefixer: {
				flexbox: 'no-2009',
			},
			stage: 3,
			features: {
				'nesting-rules': true,
			},
		},
	},
};
