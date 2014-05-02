[![Build Status](https://travis-ci.org/bjornstar/timed-number.png)](https://travis-ci.org/bjornstar/timed-number)

timed-number
==========

A little wrapper to help deal with numbers that change over time.

Example usage:
```javascript
var TimedNumber = require('timed-number');

var hp = {
	interval: 1,
	max: 10,
	min: 0,
	rate: 1 / 1, // goes up by one every second
	val: 3,
	interval: 1 // how often the timed number will tick in seconds.
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

####nextTick()
Returns in unix time when the next tick will triggered

####lastTick()
Returns in unix time when the last tick got triggered

####finalTick()
Returns in unix time when the final tick will triggered, meaning when the value get to its max/min


###Properties:
####last
The last time this number was updated. Defaults to 0.

####max
The maximum value this number can be. Defaults to Infinity.

####min
The minimum value this number can be. Defaults to -Infinity.

####rate
The amount to change the value per tick. Defaults to 0.

####interval
The amount of time between ticks, in seconds. Defaults to 1.

####val
The value of the number at the time of the last update.
