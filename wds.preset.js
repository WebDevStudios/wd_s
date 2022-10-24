const plugin = require( 'tailwindcss/plugin' );

// Get arrays of all of the files.
module.exports = {
	safelist: [ 'wds-grid' ],
	theme: {
		fontSize: {
			'root-em': '16px',
			xs: '0.75rem',
			sm: '0.875rem',
			base: '1rem',
			lg: '1.125rem',
			xl: '1.25rem',
			'2xl': '1.375rem',
			'3xl': '1.5rem',
			'4xl': '1.625rem',
			'5xl': '1.75rem',
			'6xl': '1.875rem',
			'heading-xs': '2rem',
			'heading-sm': '2.125rem',
			'heading-md': '2.375rem',
			'heading-lg': '2.625rem',
			'heading-xl': '2.875rem',
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
		boxShadow: {
			xs: '0 0 0 0.0625rem rgba(0, 0, 0, 0.05)',
			sm: '0 0.0625rem 0.125rem 0 rgba(0, 0, 0, 0.05)',
			default:
				'0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.1), 0 0.0625rem 0.125rem 0 rgba(0, 0, 0, 0.06)',
			md: '0 0.25rem 0.375rem -0.0625rem rgba(0, 0, 0, 0.1), 0 0.125rem 0.25rem -0.0625rem rgba(0, 0, 0, 0.06)',
			lg: '0 0.625rem 0.9375 -0.1875rem rgba(0, 0, 0, 0.1), 0 0.25rem 0.375rem -0.125rem rgba(0, 0, 0, 0.05)',
			xl: '0 1.25rem 1.5625rem -0.3125rem rgba(0, 0, 0, 0.1), 0 0.625rem 0.625rem -0.3125rem rgba(0, 0, 0, 0.04)',
			'2xl': '0 1.5625rem 3.125rem -10.125rem rgba(0, 0, 0, 0.25)',
			'3xl': '0 2.1875rem 3.75rem -0.9375rem rgba(0, 0, 0, 0.3)',
			inner: 'inset 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.06)',
			outline: '0 0 0 0.1875rem rgba(66, 153, 225, 0.5)',
			focus: '0 0 0 0.1875rem rgba(66, 153, 225, 0.5)',
			none: 'none',
		},
		screens: {
			phone: '300px',
			'max-tablet-portrait': { max: '600px' },
			'tablet-portrait': '600px',
			'wp-admin-bar': '783px',
			'tablet-landscape': '900px',
			'desktop-min': { min: '1200px' },
			desktop: '1200px',
			'desktop-large': '1600px',
		},
		container: ( theme ) => ( {
			center: true,
			screens: {
				phone: '100%',
				desktop: '1200px',
			},
			padding: {
				DEFAULT: theme( 'spacing.16' ),
				'desktop-large': '0',
			},
		} ),
		extend: {
			backgroundOpacity: {
				10: '0.1',
			},
			colors: {
				wds: {
					orange: '#f3713c',
				},
			},
		},
	},
	variants: {},
	plugins: [
		plugin( function ( { addBase, config } ) {
			addBase( {
				html: {
					fontSize: '100%',
				},
				'h1,.h1': {
					fontSize: config( 'theme.fontSize.heading-xl' ),
				},
				'h2,.h2': {
					fontSize: config( 'theme.fontSize.heading-lg' ),
				},
				'h3,.h3': {
					fontSize: config( 'theme.fontSize.heading-md' ),
				},
				'h4,.h4': {
					fontSize: config( 'theme.fontSize.heading-sm' ),
				},
				'h5,.h5': {
					fontSize: config( 'theme.fontSize.heading-xs' ),
				},
				'h6,.h6': {
					fontSize: config( 'theme.fontSize.heading-xs' ),
				},
				'h1,h2,h3,h4,h5,h6,.h1,.h2,.h3,.h4,.h5,.h6': {
					marginBottom: config( 'theme.spacing.16' ),
					fontWeight: 600,
					lineHeight: '1.25',
				},
				a: {
					textDecoration: 'underline',
				},
				p: {
					marginBottom: config( 'theme.spacing.16' ),
					'&:last-child': {
						marginBottom: '0',
					},
					lineHeight: '1.5',
				},
				'.button': {
					padding: config( 'theme.spacing.16' ),
				},
				'table,dl,ol,ul,address,pre,blockquote,iframe': {
					marginBottom: config( 'theme.spacing.16' ),
				},
				pre: {
					overflow: 'auto',
				},
			} );
		} ),
		plugin( function ( { addComponents, config } ) {
			const screenReaderText = {
				'.screen-reader-text': {
					clip: 'rect(1px, 1px, 1px, 1px)',
					height: '1px',
					overflow: 'hidden',
					position: 'absolute',
					whiteSpace: 'nowrap',
					width: '1px',
					'&:hover,&:active,&:focus': {
						backgroundColor: config( 'theme.colors.black' ),
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
			};

			addComponents( screenReaderText, {
				variants: [ 'hover', 'active', 'focus' ],
			} );
		} ),
		plugin( function ( { addUtilities } ) {
			addUtilities( {
				'.wds-grid': {
					display: 'grid',
					gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
					columnGap: '1rem',
				},
			} );
		} ),
	],
};
