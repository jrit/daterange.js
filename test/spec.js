var assert = require( "assert" );
var daterange = require( "../src/daterange.js" );

/**
 * Mocha tests
 */ 

describe( 'daterange', function ()
{
	var first = new Date( 2000, 0, 1 );
	var second = new Date( 2000, 0, 2 );
	var third = new Date( 2000, 0, 3 );
	var fourth = new Date( 2000, 0, 4 );

	var firstX = new Date( 2000, 0, 1 );
	var secondX = new Date( 2000, 0, 2 );
	var thirdX = new Date( 2000, 0, 3 );
	var fourthX = new Date( 2000, 0, 4 );

	it( 'should require start/end', function ( done )
	{
		assert.throws( function () { daterange.create() } );
		assert.throws( function () { daterange.create( new Date() ) } );
		assert.throws( function () { daterange.create( null, new Date() ) } );
		done();
	} );

	it( 'should have equals', function ( done )
	{
		assert( daterange.create( first, second ).equals( daterange.create( firstX, secondX ) ) );
		assert( !daterange.create( first, second ).equals( daterange.create( firstX, thirdX ) ) );
		done();
	} );

	it( 'should have contains', function ( done )
	{
		assert( daterange.create( first, third ).contains( daterange.create( firstX, secondX ) ) );
		assert( !daterange.create( first, second ).contains( daterange.create( firstX, thirdX ) ) );
		done();
	} );

	it( 'should have overlaps', function ( done )
	{
		var otherStart = new Date( 2000, 1, 1 );
		var otherEnd = new Date( 2000, 1, 2 );

		assert( daterange.create( first, third ).overlaps( daterange.create( firstX, secondX ) ) );
		assert( daterange.create( first, second ).overlaps( daterange.create( firstX, thirdX ) ) );
		assert( !daterange.create( first, second ).overlaps( daterange.create( otherStart, otherEnd ) ) );
		assert( !daterange.create( first, second ).overlaps( daterange.create( secondX, thirdX ) ) );
		done();
	} );


	it( 'should have simple subtract', function ( done )
	{
		var diff = daterange.create( first, third ).subtract( daterange.create( firstX, secondX ) );

		assert( diff.length === 1 );
		assert( diff[0].start.getTime() === second.getTime() );
		assert( diff[0].end.getTime() === third.getTime() );
		done();
	} );

	it( 'should have simple add', function ( done )
	{
		var sum = daterange.create( first, third ).add( daterange.create( firstX, secondX ) );

		assert( sum.length === 1 );
		assert( sum[0].start.getTime() === first.getTime() );
		assert( sum[0].end.getTime() === third.getTime() );
		done();
	} );

	it( 'should have simple add with broken ranges', function ( done )
	{
		var sum = daterange.create( first, second ).add( daterange.create( third, fourth ) );

		assert( sum.length === 2 );
		assert( sum[0].start.getTime() === first.getTime() );
		assert( sum[0].end.getTime() === second.getTime() );
		assert( sum[1].start.getTime() === third.getTime() );
		assert( sum[1].end.getTime() === fourth.getTime() );
		done();
	} );
	
	it( 'should have empty subtract when nothing to return', function ( done )
	{
		var diff = daterange.create( second, third ).subtract( daterange.create( firstX, thirdX ) );

		assert( diff.length === 0 );
		done();
	} );

	it( 'should have 2 results from subtract when splitting', function ( done )
	{
		var diff = daterange.create( first, fourth ).subtract( daterange.create( secondX, thirdX ) );

		assert( diff.length === 2 );
		assert( diff[0].start.getTime() === first.getTime() );
		assert( diff[0].end.getTime() === second.getTime() );
		assert( diff[1].start.getTime() === third.getTime() );
		assert( diff[1].end.getTime() === fourth.getTime() );
		done();
	} );

	it( 'should sum empty ranges', function ( done )
	{
		var sum = daterange.sum( [] );

		assert( sum.length === 0 );
		done();
	} );

	it( 'should sum continuous ranges', function ( done )
	{
		var sum = daterange.sum( [daterange.create( first, second ), daterange.create( second, third ), daterange.create( second, fourth )] );

		assert( sum.length === 1 );
		assert( sum[0].start.getTime() === first.getTime() );
		assert( sum[0].end.getTime() === fourth.getTime() );
		done();
	} );

	it( 'should sum broken up ranges', function ( done )
	{
		var sum = daterange.sum( [daterange.create( first, second ), daterange.create( third, fourth ), daterange.create( fourth, fourth )] );

		assert( sum.length === 2 );
		assert( sum[0].start.getTime() === first.getTime() );
		assert( sum[0].end.getTime() === second.getTime() );
		assert( sum[1].start.getTime() === third.getTime() );
		assert( sum[1].end.getTime() === fourth.getTime() );
		done();
	} );

	it( 'should sum a forward range', function ( done )
	{
		var ranges = [];

		for ( var i = 1; i < 11; i++ )
		{
			ranges.push( daterange.create( new Date( 2000, 0, i * 3 ), new Date( 2000, 0, i * 3 + 1 ) ) );
		}
		var sum = daterange.sum( ranges );

		assert( sum.length === 10, sum.length );
		done();
	} );

	it( 'should sum a large forward range', function ( done )
	{
		var ranges = [];

		for ( var i = 1; i < 1000; i++ )
		{
			ranges.push( daterange.create( new Date( 2000, 0, i ), new Date( 2000, 0, i*2 ) ) );
		}
		var sum = daterange.sum( ranges );

		assert( sum.length === 1, sum.length );
		done();
	} );

	it( 'should sum a backward range', function ( done )
	{
		var ranges = [];

		for ( var i = 10; i > 1; i-- )
		{
			ranges.push( daterange.create( new Date( 2000, 0, i ), new Date( 2000, 0, i * 2 ) ) );
		}
		var sum = daterange.sum( ranges );

		assert( sum.length === 1, sum.length );
		done();
	} );

} );