const fs = require( 'fs' );
const path = require( 'path' );
const glob = require( 'glob' );

// Get arrays of all of the files.
const topLevelPhpFiles = glob.sync( './*.php' ),
	directoryFiles = [
		'./inc/*.php',
		'./template-parts/*.php',
		'./src/js/**/*.js',
	];

const themeJsonPath = path.join( __dirname, 'theme.json' );
const themeJson = fs.readFileSync( themeJsonPath );
const theme = JSON.parse( themeJson );

const { palette } = theme.settings.color;
const colors = palette.reduce( ( acc, item ) => {
	const [ color, number ] = item.slug.split( '-' );

	if ( number ) {
		// If there is a number identifier, make this an object
		if ( ! acc[ color ] ) {
			acc[ color ] = {};
		}
		acc[ color ][ number ] = item.color;
	} else {
		acc[ color ] = item.color;
	}

	return acc;
}, {} );

module.exports = {
	corePlugins: {
		preflight: false,
	},
	content: topLevelPhpFiles.concat( directoryFiles ),
	theme: { colors },
};
