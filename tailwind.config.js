const glob = require( 'glob' );
const path = require( 'path' );

// Get arrays of all of the files.
const topLevelPhpFiles = glob.sync( './*.php' ),
	directoryFiles = [
		'./inc/*.php',
		'./template-parts/*.php',
		'./src/js/**/*.js',
	];

module.exports = {
	content: topLevelPhpFiles.concat( directoryFiles ),
	presets: [ require( path.join( __dirname, './wds.preset.js' ) ) ],
};
