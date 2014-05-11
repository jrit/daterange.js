﻿
( function ( daterange )
{
	/**
	* @class daterange
	*/

	var rangeSortStart = function ( a, b )
	{
		return ( a.start.getTime() - b.start.getTime() );
	};

	var rangeSortEnd = function ( a, b )
	{
		return ( a.end.getTime() - b.end.getTime() );
	};

	var copyArray = function ( src )
	{
		var copy = [];
		src.forEach( function ( item ) { copy.push( item ); } );
		return ( copy );
	};

	var find = function ( array, predicate )
	{
		for ( var i = 0; i < array.length; i++ )
		{
			if ( predicate( array[i] ) )
			{
				return ( array[i] );
			}
		}

		return ( null );
	};

	daterange.equals = function ( range1, range2 )
	{
		return ( range1.start.getTime() === range2.start.getTime()
					&& range1.end.getTime() === range2.end.getTime() );
	};

	daterange.contains = function ( outer, inner )
	{
		return ( !outer.equals( inner ) 
					&& outer.start.getTime() <= inner.start.getTime() 
					&& outer.end.getTime() >= inner.end.getTime() );
	};

	daterange.overlaps = function ( range1, range2 )
	{
		return ( range1.equals( range2 )
					|| range1.contains( range2 )
					|| range2.contains( range1 )
					|| range1.start.getTime() < range2.start.getTime() && range1.end.getTime() > range2.start.getTime()
					|| range2.start.getTime() < range1.start.getTime() && range2.end.getTime() > range1.start.getTime() );
	};

	daterange.subtract = function ( range1, diffRange )
	{
		if ( range1.equals( diffRange ) || diffRange.contains( range1 ) )
		{
			return ( [] ); //none
		}

		var parts = [exports.create( range1.start, diffRange.start ), exports.create( diffRange.end, range1.end )];
		return ( parts.filter( function ( item )
		{
			return ( item.end.getTime() > item.start.getTime() );
		} ) );
	};

	daterange.create = function ( start, end )
	{
		if ( !start || !end )
		{
			throw "start and end are required";
		}

		var me = {
			start: start,
			end: end,
			/**
			 * @method equals
			 * @param {daterange} range2
			 * @return {Boolean}
			 */
			equals: function ( range2 )
			{
				return ( daterange.equals( me, range2 ) );
			},
			/**
			 * @method contains
			 * @param {daterange} inner
			 * @return {Boolean}
			 */
			contains: function ( inner )
			{
				return ( daterange.contains( me, inner ) );
			},
			/**
			 * @method overlaps
			 * @param {daterange} range2
			 * @return {Boolean}
			 */
			overlaps: function ( range2 )
			{
				return ( daterange.overlaps( me, range2 ) );
			},
			/**
			 * @method subtract
			 * @param {daterange} diffRange
			 * @return {Array}
			 */
			subtract: function ( diffRange )
			{
				return( daterange.subtract( me, diffRange ) );
			},
			/**
			 * @method subtract
			 * @param {daterange} range2
			 * @return {Array}
			 */
			add: function ( range2 )
			{
				return ( exports.sum( [me, range2] ) );
			}
		};

		return ( me );
	};

	/**
	 * @method sum
	 * @param {Array} ranges
	 * @return {Array}
	 */
	daterange.sum = function ( ranges )
	{
		var ordered = ranges.sort( rangeSortStart );
		var orderedRemaining = copyArray( ordered );
		var summed = [];

		var combine = function ( item, index, array )
		{
			var overlappingEnd = find( orderedRemaining, function ( a )
			{
				return ( item.end.getTime() === a.start.getTime() || item.overlaps( a ) )
			} );

			if ( overlappingEnd )
			{
				var newRange = exports.create( item.start, overlappingEnd.end );
				
				var overlappingSum =
					summed
					.filter( function ( a )
					{
						return ( a.end.getTime() === newRange.start.getTime() || a.overlaps( newRange ) );
					} )
					.sort( rangeSortEnd );

				if ( overlappingSum.length )
				{
					if ( overlappingSum[0].end < newRange.end )
					{
						overlappingSum[overlappingSum.length - 1].end = newRange.end;
					}
				}
				else
				{
					summed.push( newRange );
				}
			}
			else
			{
				summed.push( item );
			}

			orderedRemaining = orderedRemaining.slice( 1 );
		};

		ordered.forEach( combine );

		return ( summed );
	};

} )( typeof exports === 'undefined' ? this['daterange'] = {} : exports );
