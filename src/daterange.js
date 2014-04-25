
( function ( exports )
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

	exports.create = function ( start, end )
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
				return ( me.start.getTime() === range2.start.getTime() && me.end.getTime() === range2.end.getTime() );
			},
			/**
			 * @method contains
			 * @param {daterange} inner
			 * @return {Boolean}
			 */
			contains: function ( inner )
			{
				return ( !me.equals( inner ) && me.start.getTime() <= inner.start.getTime() && me.end.getTime() >= inner.end.getTime() );
			},
			/**
			 * @method overlaps
			 * @param {daterange} range2
			 * @return {Boolean}
			 */
			overlaps: function ( range2 )
			{
				return (
					me.equals( range2 )
					|| me.contains( range2 )
					|| range2.contains( me )
					|| me.start.getTime() < range2.start.getTime() && me.end.getTime() > range2.start.getTime()
					|| range2.start.getTime() < me.start.getTime() && range2.end.getTime() > me.start.getTime() );
			},
			/**
			 * @method subtract
			 * @param {daterange} range2
			 * @return {Array}
			 */
			subtract: function ( range2 )
			{
				if ( me.equals( range2 ) || range2.contains( me ) )
				{
					return ( [] ); //none
				}
				
				var parts = [exports.create( me.start, range2.start ), exports.create( range2.end, me.end )];
				return ( parts.filter( function ( item )
					{
					return ( item.end.getTime() > item.start.getTime() );
					} ) );
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
	exports.sum = function ( ranges )
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

