const glob = require( 'glob' );

// Get arrays of all of the files.
const topLevelPhpFiles = glob.sync( './*.php' ),
	directoryFiles = [
		'./inc/*.php',
		'./template-parts/*.php',
		'./src/js/**/*.js',
	];

module.exports = {
	content: topLevelPhpFiles.concat( directoryFiles ),
};
