var assert = require( "assert" );
var daterange = require( "../index.js" );

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

	var testRanges = {};
	testRanges.first = {};
	testRanges.second = {};
	testRanges.third = {};
	testRanges.fourth = {};
	testRanges.fifth = {};
	// these two overlap
	testRanges.first.start = new Date( 2000, 6, 1 );
	testRanges.first.end = new Date( 2001, 0, 1 );
	testRanges.second.start = new Date( 2000, 9, 1 );
	testRanges.second.end = new Date( 2001, 3, 1 );
	testRanges.third.start = new Date( 2001, 0, 1 );
	testRanges.third.end = new Date( 2001, 6, 1 );
	// these do not overlap
	testRanges.fourth.start = new Date( 2002, 6, 1 );
	testRanges.fourth.end = new Date( 2003, 6, 1 );
	testRanges.fifth.start = new Date( 2004, 0, 1 );
	testRanges.fifth.end = new Date( 2004, 6, 1 );

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

	it( 'should sum forward broken ranges', function ( done )
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

	it( 'should sum a large continuous forward range', function ( done )
	{
		var ranges = [];

		for ( var i = 1; i < 2000; i++ )
		{
			ranges.push( daterange.create( new Date( 2000, 0, i ), new Date( 2000, 0, i * 2 ) ) );
		}
		var sum = daterange.sum( ranges );

		assert( sum.length === 1, sum.length );
		done();
	} );

	it( 'should sum a backward continuous range', function ( done )
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

	it( 'should inverse empty ranges', function ( done )
	{
		var inverse = daterange.inverse( [] );

		assert( inverse.length === 0 );
		done();
	} );

	it( 'should inverse continuous ranges', function ( done )
	{
		var inverse = daterange.inverse( [ daterange.create( testRanges.third.start, testRanges.third.end ), daterange.create( testRanges.first.start, testRanges.first.end ), daterange.create( testRanges.second.start, testRanges.second.end )] );

		assert( inverse.length === 0 );
		done();
	} );

	it( 'should inverse broken up ranges', function ( done )
	{
		var inverse = daterange.inverse( [daterange.create( testRanges.first.start, testRanges.first.end ), daterange.create( testRanges.fourth.start, testRanges.fourth.end )] );

		assert( inverse.length === 1 );
		assert( inverse[0].start.getTime() === testRanges.first.end.getTime() );
		assert( inverse[0].end.getTime() === testRanges.fourth.start.getTime() );
		done();
	} );

	it( 'should inverse continuous and broken up ranges', function ( done )
	{
		var inverse = daterange.inverse( [ daterange.create( testRanges.fifth.start, testRanges.fifth.end), daterange.create( testRanges.third.start, testRanges.third.end ), daterange.create( testRanges.first.start, testRanges.first.end ), daterange.create( testRanges.second.start, testRanges.second.end ), daterange.create( testRanges.fourth.start, testRanges.fourth.end )] );

		assert( inverse.length === 2 );
		assert( inverse[0].start.getTime() === testRanges.third.end.getTime() );
		assert( inverse[0].end.getTime() === testRanges.fourth.start.getTime() );
		assert( inverse[1].start.getTime() === testRanges.fourth.end.getTime() );
		assert( inverse[1].end.getTime() === testRanges.fifth.start.getTime() );
		done();
	} );

	it( 'should inverse a large continuous forward range', function ( done )
	{
		var ranges = [];

		for ( var i = 1; i < 2000; i++ )
		{
			ranges.push( daterange.create( new Date( 2000, 0, i ), new Date( 2000, 0, i*2 ) ) );
		}
		var inverse = daterange.inverse( ranges );

		assert( inverse.length === 0 );
		done();
	} );

	it( 'should inverse many broken up ranges', function ( done )
	{
		var ranges = [];

		for ( var i = 0; i < 500; i++ )
		{
			ranges.push( daterange.create( new Date( (2000+i), 0, 1 ), new Date( (2000+i), 0, 6) ) );
		}
		var inverse = daterange.inverse( ranges );

		assert( inverse.length === ( i - 1 ) );
		done();
	} );

} );