const plugin = require( 'tailwindcss/plugin' );

module.exports = {
	purge: {
		content: ['./**/*.php'],
		layers: ['utilities'],
		mode: 'layers',
	},
	theme: {
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
					fontSize: config( 'theme.fontSize.5xl' ),
				},
				'h2,.h2': {
					fontSize: config( 'theme.fontSize.4xl' ),
				},
				'h3,.h3': {
					fontSize: config( 'theme.fontSize.3xl' ),
				},
				'h4,.h4': {
					fontSize: config( 'theme.fontSize.2xl' ),
				},
				'h5,.h5': {
					fontSize: config( 'theme.fontSize.xl' ),
				},
				'h6,.h6': {
					fontSize: config( 'theme.fontSize.lg' ),
				},
				'h1,h2,h3,h4,h5,h6,.h1,.h2,.h3,.h4,.h5,.h6': {
					marginBottom: config( 'theme.spacing.4' ),
				},
				'a': {
					textDecoration: 'underline',
				},
				'p': {
					marginBottom: config( 'theme.spacing.4' ),
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
						padding: config( 'theme.spacing.4' ),
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
