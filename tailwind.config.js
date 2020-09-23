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
				'*, ::before, ::after': {
					boxSizing: 'border-box',
					wordBreak: 'unset',
					wordWrap: 'unset',
				},
				'h1,.h1': {
					fontSize: config( 'theme.fontSize.5xl' ),
					marginBottom: config( 'theme.spacing.2' ),
				},
				'h2,.h2': {
					fontSize: config( 'theme.fontSize.4xl' ),
					marginBottom: config( 'theme.spacing.2' ),
				},
				'h3,.h3': {
					fontSize: config( 'theme.fontSize.3xl' ),
					marginBottom: config( 'theme.spacing.2' ),
				},
				'h4,.h4': {
					fontSize: config( 'theme.fontSize.2xl' ),
					marginBottom: config( 'theme.spacing.2' ),
				},
				'h5,.h5': {
					fontSize: config( 'theme.fontSize.xl' ),
					marginBottom: config( 'theme.spacing.2' ),
				},
				'h6,.h6': {
					fontSize: config( 'theme.fontSize.lg' ),
					marginBottom: config( 'theme.spacing.2' ),
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
			const postDetails = {
				'.entry-meta': {
					marginBottom: config( 'theme.spacing.4' ),
				},
				'.entry-footer': {
					marginTop: config( 'theme.spacing.4' ),
				},
				'.cat-links,.tag-links': {
					display: 'block',
				},
				'.post-edit-link': {
					display: 'block',
					marginBottom: config( 'theme.spacing.4' ),
					marginTop: config( 'theme.spacing.4' ),
				},
				'.post-container': {
					'&:not(:last-child)': {
						marginBottom: config( 'theme.spacing.4' ),
					},
				},
				'.post-navigation .nav-links': {
					display: 'flex',
					flexDirection: 'column',
					textAlign: 'center',
					'@screen tablet-landscape': {
						flexDirection: 'row',
						justifyContent: 'space-between',
						textAlign: 'unset',
					},
				},
				'.post-navigation .nav-next': {
					marginTop: config( 'theme.spacing.4' ),
					'@screen tablet-landscape': {
						marginTop: '0',
					},
				},
				'.comments-link': {
					marginTop: config( 'theme.spacing.4' ),
				},
				'.comments-area': {
					marginTop: config( 'theme.spacing.6' ),
				},
				'.comment-author': {
					alignItems: 'center',
					display: 'flex',
					marginBottom: config( 'theme.spacing.4' ),
				},
				'.comment-author .avatar': {
					marginRight: config( 'theme.spacing.4' ),
				},
				'.comment-author .fn': {
					marginRight: config( 'theme.spacing.2' ),
				},
				'.comment-metadata': {
					marginBottom: config( 'theme.spacing.4' ),
				},
				'.comment-content': {
					backgroundColor: config( 'theme.colors.blue.100' ),
					padding: config( 'theme.spacing.4' ),
				},
				'.comment-list .children': {
					marginLeft: config( 'theme.spacing.4' ),
				},
				'.comment-reply-title a': {
					display: 'block',
					fontSize: config( 'theme.fontSize.sm' ),
				},
				'.updated': {
					'&:not(.published)': {
						display: 'none',
					},
				},
			}

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

			const globalElements = {
				'.button': {
					padding: config( 'theme.spacing.4' ),
				},
				'*, ::after, ::before': {
					boxSizing: 'inherit',
					wordBreak: 'break-word',
					wordWrap: 'break-word',
				},
				'pre': {
					overflow: 'auto',
				},
			}

			const menus = {
				'.main-navigation .menu': {
					display: 'flex',
					'> li': {
						'&:not(:last-child)': {
							marginRight: config( 'theme.spacing.4' ),
						},
					},
				},
				'.menu-item-has-children': {
					position: 'relative',
					'&:hover, &.focus': {
						'> .sub-menu': {
							left: '0',
						},
					},
				},
				'.sub-menu': {
					backgroundColor: config( 'theme.colors.white' ),
					boxShadow: '0 .1875rem .1875rem rgba(0,0,0,.5)',
					left: '-999em',
					padding: `${ config( 'theme.spacing.2' ) } 0`,
					position: 'absolute',
					top: '1.5rem',
					zIndex: '99999',
					'li': {
						padding: `${ config( 'theme.spacing.2' ) } ${ config( 'theme.spacing.6' ) }`,
					},
					'.menu-item-has-children': {
						'&:hover, &.focus': {
							'> .sub-menu': {
								left: '100%',
							},
						},
					},
				},
				'.dropdown': {
					'ul': {
						'li': {
							width: '100%',
						},
						'a': {
							display: 'block',
							minWidth: config( 'theme.width.48' ),
							width: '100%',
						},
					},
				},
				'.bg-menu': {
					backgroundImage: 'url("/wp-content/themes/wd_s/build/images/icons/caret-down.svg")',
					backgroundPosition: '50% 50%',
					backgroundRepeat: 'no-repeat',
					backgroundSize: '100%',
					display: 'block',
					float: 'right',
					width: config( 'theme.spacing.2' ),
					height: '100%',
					marginLeft: config( 'theme.spacing.2' ),
				},
			}

			const forms = {
				'textarea, input:not(.button)': {
					backgroundColor: config( 'theme.colors.gray.100' ),
					padding: config( 'theme.spacing.2' ),
				},
				'label': {
					display: 'block',
					fontWeight: config( 'theme.fontWeight.semibold' ),
					marginBottom: config( 'theme.spacing.1' ),
				},
			}

			const templateElements = {
				'.container': {
					paddingLeft: config( 'theme.spacing.4' ),
					paddingRight: config( 'theme.spacing.4' ),
					'@screen desktop-large': {
						paddingLeft: '0',
						paddingRight: '0',
					}
				},
				'.site-main': {
					marginBottom: config( 'theme.spacing.12' ),
					marginTop: config( 'theme.spacing.12' ),
				},
				'.archive-description': {
					marginBottom: config( 'theme.spacing.6' ),
				},
				'.alignleft': {
					float: 'left',
					marginBottom: config( 'theme.spacing.4' ),
					marginRight: config( 'theme.spacing.4' ),
				},
				'.alignright': {
					float: 'right',
					marginBottom: config( 'theme.spacing.4' ),
					marginLeft: config( 'theme.spacing.4' ),
				},
				'.aligncenter': {
					margin: `${ config( 'theme.spacing.4' ) } auto`,
				},
				'.alignnone': {
					marginBottom: config( 'theme.spacing.4' ),
				},
			}

			addComponents( postDetails, {
				variants: ['responsive'],
			})
			addComponents( screenReaderText, {
				variants: ['hover', 'active', 'focus'],
			})
			addComponents( globalElements )
			addComponents( forms )
			addComponents( menus )
			addComponents( templateElements )
		}),
	],
}
