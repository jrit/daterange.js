module.exports = function ( grunt )
{
	grunt.initConfig( {
		watch: {
			less: {
				files: "./**/*.js",
				tasks: ["test"]
			}
		}
	} );

	grunt.registerTask( 'test', 'run mocha', function ()
	{
		var done = this.async();
		require( 'child_process' ).exec( 'mocha', function ( err, stdout )
		{
			grunt.log.write( stdout );
			done( err );
		} );
	} );;

	grunt.loadNpmTasks( "grunt-contrib-watch" );
	grunt.loadNpmTasks( 'grunt-release' );
};