[![Build Status](https://travis-ci.org/bjornstar/timed-number.png)](https://travis-ci.org/bjornstar/timed-number)

timed-number
==========

A little wrapper to help deal with numbers that change over time.

Example usage:
```javascript
var TimedNumber = require('timed-number');

var hp = {
	max: 10,
	min: 0,
	rate: 1 / 1, // goes up by one every second
	val: 3
};

var tnHP = new TimedNumber(hp);

function logHP() {
	console.log(tnHP.get());
}

setInterval(logHP, 1000);
```

By default, the time source operates in seconds. You can change this behavior by overriding the
TimedNumber's now method.

###Methods:
####get()
Returns the value of the TimedNumber at the time returned by now.

####inc( *value* )
A shortcut to add **value** to the TimedNumber, follows the same rules as set.

####now()
Returns the current time in seconds. If you want more or less granularity in your TimedNumber, you
can override this function.

####set( *value* )
Sets the TimedNumber to the **value** provided. If the value would be outside of the bounds set by
max and min, the max or min is set instead.

###Properties:
####last
The last time this number was updated. Defaults to 0.

####max
The maximum value this number can be. Defaults to Infinity.

####min
The minimum value this number can be. Defaults to -Infinity.

####rate
The amount to change the value per period of time. Defaults to 0.

####val
The value of the number at the time of the last update.