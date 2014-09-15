# daterange

daterange is a simple node/browser library to work with date ranges. 

Compare whether date ranges are equal, overlap, or contain each other. 

Subtract and add date ranges.

daterange is simple and fast.


Install via 

- `npm install daterange`
- `bower install daterange`

The bower install is just the main src file, bower.json and readme


## Example, add 2 ranges: 

```javascript
var range1 = daterange.create( new Date(2000, 0, 1), new Date(2000, 0, 3) );
var range2 = daterange.create( new Date(2000, 0, 2), new Date(2000, 0, 4) );
var result = range1.add( range2 );

result.start.getTime() === range1.start.getTime(); //true
result.end.getTime() === range2.end.getTime(); //true
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
run `mocha`

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
