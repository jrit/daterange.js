# daterange

daterange is a simple node/browser library to work with date ranges. 

Compare whether date ranges are equal, overlap, or contain each other. 

Subtract and add date ranges.

daterange is simple and fast.


Install via 

- `npm install daterange`
- `bower install daterange`

The bower install is just the main src file, bower.json and readme

## Basic Examples
##### Node Example
```javascript
var daterange = require('daterange');
var range1 = daterange.create( new Date(2000, 0, 1), new Date(2000, 0, 3) );
```
##### Browser Example
```html
<script src="/bower_components/daterange/src/daterange.js"></script>
<script>
  var range1 = daterange.create( new Date(2000, 0, 1), new Date(2000, 0, 3) );
</script>
```
### Examples cont.

##### Add 2 ranges: 
```javascript
var range1 = daterange.create( new Date(2000, 0, 1), new Date(2000, 0, 3) );
var range2 = daterange.create( new Date(2000, 0, 2), new Date(2000, 0, 4) );
var result = range1.add( range2 );

result[0].start.getTime() === range1.start.getTime(); // true
result[0].end.getTime() === range2.end.getTime(); // true
```
##### Sum 2 continuous ranges: 
```javascript
var range1 = daterange.create( new Date(2000, 0, 1), new Date(2000, 0, 3) );
var range2 = daterange.create( new Date(2000, 0, 2), new Date(2000, 0, 4) );
var result = daterange.sum( [range1, range2] );

result[0].start.getTime() === range1.start.getTime(); // true
result[0].end.getTime() === range2.end.getTime(); // true
```
##### Sum 3 ranges with break inbetween: 
```javascript
var range1 = daterange.create( new Date(2000, 0, 1), new Date(2000, 0, 3) );
var range2 = daterange.create( new Date(2000, 0, 2), new Date(2000, 0, 5) );
var range3 = daterange.create( new Date(2000, 0, 7), new Date(2000, 0, 8) );
var result = daterange.sum( [range1, range2, range3] );

result.length; // 2
result[0].start.getTime() === range1.start.getTime(); // true
result[0].end.getTime() === range2.end.getTime(); // true
result[1].start.getTime() === range3.start.getTime(); // true
result[1].end.getTime() === range3.end.getTime(); // true
```
##### Inverse ( Identify gaps in summed ranges ): 
```javascript
var range1 = daterange.create( new Date(2000, 0, 2), new Date(2000, 0, 5) );
var range2 = daterange.create( new Date(2000, 0, 7), new Date(2000, 0, 8) );
var result = daterange.inverse( [range1, range2] );

result[0].start.getTime() === range1.end.getTime(); // true
result[0].end.getTime() === range2.start.getTime(); // true
```
```javascript
// Illustration:
//
// range1      end1  start2  end2
// v             v     v      v
// #-------------#     #------#
//
//               #-----#
//               ^     ^
//          start  GAP  end
```

## daterange Methods:

```javascript
range = daterange.create(Date, Date);
ranges = daterange.sum([range,range,...]);
bool = daterange.equals(range1, range2);
bool = daterange.contains(outer, inner);
bool = daterange.overlaps(range1, range2);
ranges = daterange.subtract(range1, diffRange);
```

## daterange Instance Methods, from daterange.create:

```javascript
bool = range.equals(range);
bool = range.contains(range);
bool = range.overlaps(range);
ranges = range.subtract(range);
ranges = range.add(range);
```

## tests

Run tests

- `npm test`

Run tests and code coverage report

- `npm run coverage`


## License
The MIT License (MIT)

Copyright (c) 2014 Jarrett Widman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
