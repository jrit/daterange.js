daterange
======================

daterange is a simple node/browser library to work with date ranges. 

Compare whether date ranges are equal, overlap, or contain each other. 

Subtract and add date ranges.


Example, add 2 ranges: 

`var range1 = daterange.create( new Date(2000, 0, 1), new Date(2000, 0, 3) );`

`var range2 = daterange.create( new Date(2000, 0, 2), new Date(2000, 0, 4) );`

`var result = range1.add( range2 );`

`> result.start.getTime() === range1.start.getTime()`

`> result.end.getTime() === range2.end.getTime()`


Complete list of operations:

* `range = daterange.create(Date, Date)`
* `ranges = daterage.sum([range,range,...])`
* `bool = range.equals(range)`
* `bool = range.contains(range)`
* `bool = range.overlaps(range)`
* `ranges = range.subtract(range)`
* `ranges = range.add(range)`