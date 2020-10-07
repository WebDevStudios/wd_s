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
				'table,dl,ol,ul,address,pre,blockquote,iframe': {
					marginBottom: config( 'theme.spacing.4' ),
				},
				'table': {
					border: '0',
					borderCollapse: 'collapse',
					borderSpacing: '0',
					padding: '0',
					width: '100%',
					'@screen wp-admin-bar': {
						border: `1px solid ${config( 'theme.colors.black' )}`,
					},
					'thead': {
						display: 'none',

						'@screen wp-admin-bar': {
							display: 'table-row-group',
						},
					},
					'th,td': {
						padding: config( 'theme.spacing.2' ),
						textAlign: 'center',

						'@screen wp-admin-bar': {
							display: 'table-cell',
						},
					},
					'td': {
						border: `1px solid ${config( 'theme.colors.black' )}`,
						borderBottom: '0',
						display: 'block',
						fontSize: config( 'theme.fontSize.base' ),
						textAlign: 'center',
						'@screen wp-admin-bar': {
							borderBottom: '0',
							display: 'table-cell',
						},
						'&:last-child': {
							borderBottom: `1px solid ${config( 'theme.colors.black' )}`,
						},
						'&::before': {
							content: 'attr(data-label)',
							display: 'block',
							fontWeight: config( 'theme.fontWeight.semibold' ),
							textTransform: 'uppercase',

							'@screen wp-admin-bar': {
								display: 'none',
							},
						},
					},
					'th': {
						border: `1px solid ${config( 'theme.colors.black' )}`,
						fontSize: config( 'theme.fontSize.base' ),
						letterSpacing: config( 'theme.letterSpacing.widest' ),
						textTransform: 'uppercase',
						'@screen phone': {
							display: 'table-cell',
						},
					},
					'tr': {
						display: 'block',
						marginBottom: config( 'theme.spacing.4' ),
						'@screen wp-admin-bar': {
							display: 'table-row',
							marginBottom: '0',
						},
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
