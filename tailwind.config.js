const plugin = require( 'tailwindcss/plugin' );

module.exports = {
	purge: {
		content: ['./**/*.php'],
		layers: ['utilities'],
		mode: 'layers',
	},
	theme: {
		fontSize: {
			'root-em': '16px',
			'xs': '0.75rem',
			'sm': '0.875rem',
			'base': '1rem',
			'lg': '1.125rem',
			'xl': '1.25rem',
			'2xl': '1.375rem',
			'3xl': '1.5rem',
			'4xl': '1.625rem',
			'5xl': '1.75rem',
			'6xl': '1.875rem',
		},
		spacing: {
			px: '1px',
			0: '0',
			1: '0.0625rem',
			2: '0.125rem',
			3: '0.1875rem',
			4: '0.25rem',
			5: '0.3125rem',
			6: '0.375rem',
			8: '0.5rem',
			10: '0.625rem',
			12: '0.75rem',
			16: '1rem',
			20: '1.25rem',
			24: '1.5rem',
			32: '2rem',
			40: '2.5rem',
			48: '3rem',
			56: '3.5rem',
			64: '4rem',
			68: '4.25rem',
			72: '4.5rem',
			76: '4.75rem',
			80: '5rem',
			192: '12rem',
		},
		extend: {
			maxHeight: {
				'0': '0',
			},
		},
		screens: {
			'phone': '300px',
			'tablet-portrait': '600px',
			'wp-admin-bar': '783px',
			'tablet-landscape': '900px',
			'desktop-min': {'min': '1200px'},
			'desktop': '1200px',
			'desktop-large': '1600px',
		},
		container: {
			center: true,
			screens: {
				'phone': '100%',
				'desktop': '1200px',
			},
		},
	},
	future: {
		purgeLayersByDefault: true,
	},
	variants: {},
	plugins: [
		plugin( function({ addBase, config }) {
			addBase({
				'h1,.h1': {
					fontSize: config( 'theme.fontSize.6xl' ),
				},
				'h2,.h2': {
					fontSize: config( 'theme.fontSize.5xl' ),
				},
				'h3,.h3': {
					fontSize: config( 'theme.fontSize.4xl' ),
				},
				'h4,.h4': {
					fontSize: config( 'theme.fontSize.3xl' ),
				},
				'h5,.h5': {
					fontSize: config( 'theme.fontSize.2xl' ),
				},
				'h6,.h6': {
					fontSize: config( 'theme.fontSize.xl' ),
				},
				'h1,h2,h3,h4,h5,h6,.h1,.h2,.h3,.h4,.h5,.h6': {
					marginBottom: config( 'theme.spacing.16' ),
				},
				'a': {
					textDecoration: 'underline',
				},
				'p': {
					marginBottom: config( 'theme.spacing.16' ),
					'&:last-child': {
						marginBottom: '0',
					},
				},
			})
		}),
		plugin( function({ addComponents, config }) {
			const screenReaderText = {
				'.screen-reader-text': {
					clip: 'rect(1px, 1px, 1px, 1px)',
					height: '1px',
					overflow: 'hidden',
					position: 'absolute',
					whiteSpace: 'nowrap',
					width: '1px',
					'&:hover,&:active,&:focus': {
						backgroundColor: config( 'theme.colors.blue.600' ),
						clip: 'auto',
						color: config( 'theme.colors.white' ),
						display: 'block',
						fontSize: config( 'theme.fontSize.base' ),
						fontWeight: config( 'theme.fontWeight.medium' ),
						height: 'auto',
						left: '5px',
						lineHeight: 'normal',
						padding: config( 'theme.spacing.8' ),
						textDecoration: 'none',
						top: '5px',
						width: 'auto',
						zIndex: '100000',
					},
				},
			}

			addComponents( screenReaderText, {
				variants: ['hover', 'active', 'focus'],
			})
		}),
	],
}
