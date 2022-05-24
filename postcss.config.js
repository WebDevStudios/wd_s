module.exports = {
	plugins: {
		'tailwindcss/nesting': {},
		tailwindcss: {},
		'postcss-strip-inline-comments': {},
		cssnano: {},
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
