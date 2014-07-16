var EventEmitter = require('events').EventEmitter;

function inherits(Child, Parent) {
	Child.prototype = Object.create(Parent.prototype, {
		constructor: { value: Child, enumerable: false, writable: true, configurable: true }
	});
}

var TimedNumber = function (tSource, ticks, now) {
	EventEmitter.call(this);

	if (typeof tSource !== 'object') {
		throw new Error('You must instantiate TimedNumber with an Object.');
	}

	var ticker;
	var that = this;

	this.now = now || function () {
		return Date.now() / 1000 << 0;
	};

	var lastTick = this.lastTick = function () {
		return that.now() - (that.now() - that.last) % interval;
	};

	this.get = function () {
		// The diff must be positive
		var diff = (Math.max(that.now() - tValue.last, 0) / interval) >> 0;
		var calc = tValue.val + (diff * rate);
		return Math.max(min, Math.min(max, calc));
	};

	function atLimit(val) {
		return (rate > 0 && val >= max) || (rate < 0 && val <= min);
	}

	function tick() {
		clearTimeout(ticker);

		var val = that.get();

		that.emit('tick', val);

		if (atLimit(val)) {
			return;
		}

		var diff = that.now() - tValue.last;
		var secondsUntilNextTick = interval - (diff % interval);
		var ms = secondsUntilNextTick * 1000;

		ticker = setTimeout(tick, ms);
	}

	// Detect if we're using something that has a setter, ie. tomes.
	var hasSetFunction = typeof Object.getPrototypeOf(tSource).set === 'function';

	function set(key, value) {
		if (hasSetFunction) {
			tValue.set(key, value);
		} else {
			tValue[key] = value;
			if (ticks) {
				tick();
			}
		}
	}

	this.set = function (value) {
		var oldVal = this.get();
		var newVal = Math.max(min, Math.min(max, value));

		if (atLimit(oldVal) && !atLimit(newVal)) {
			set('last', this.now());
		} else {
			set('last', lastTick());
		}

		set('val', newVal);
	};

	this.inc = function (amount) {
		var val = this.get();

		this.set(val + amount);
	};

	var tValue = this.source = tSource;

	// Set up some sane default values.

	if (!tValue.hasOwnProperty('last')) {
		set('last', this.now());
	}

	var last = this.last = tValue.last;
	var max = this.max = tValue.hasOwnProperty('max') ? tValue.max : Infinity;
	var min = this.min = tValue.hasOwnProperty('min') ? tValue.min : -Infinity;
	var rate = this.rate = tValue.hasOwnProperty('rate') ? tValue.rate : 0;
	var interval = this.interval = tValue.hasOwnProperty('interval') ? tValue.interval : 1;

	if (!tValue.hasOwnProperty('val')) {
		set('val', 0);
	}

	var tickScheduled = false;

	function scheduleTick() {
		if (tickScheduled) {
			return;
		}

		tickScheduled = true;

		setTimeout(function () {
			tickScheduled = false;
			tick();
		}, 0);
	}

	if (ticks) {
		if (hasSetFunction) {
			tValue.val.on('readable', scheduleTick);
			tValue.last.on('readable', scheduleTick);
		}
		tick();
	}

	this.nextTick = function () {
		return lastTick() + interval;
	};

	this.finalTick = function () {
		var direction = rate > 0 ? max : min;
		var diff = Math.abs(tValue.val - direction);
		return that.last + diff / rate * interval;
	};
};

inherits(TimedNumber, EventEmitter);

module.exports = TimedNumber;
