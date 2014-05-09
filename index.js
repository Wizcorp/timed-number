var EventEmitter = require('events').EventEmitter;

function inherits(Child, Parent) {
	Child.prototype = Object.create(Parent.prototype, {
		constructor: { value: Child, enumerable: false, writable: true, configurable: true }
	});
}

var TimedNumber = function (tSource, ticks) {
	EventEmitter.call(this);

	if (typeof tSource !== 'object') {
		throw new Error('You must instantiate TimedNumber with an Object.');
	}

	var ticker;
	var that = this;

	this.now = function () {
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

	function tick() {
		clearTimeout(ticker);
		that.emit('tick', that.get());
		ticker = setTimeout(tick, ((that.now() - tValue.last) % interval) * 1000);
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

	var tValue = this.source = tSource;

	// Set up some sane default values.

	if (!tValue.hasOwnProperty('last')) {
		set('last', 0);
	}

	this.last = tValue.last;
	var max = this.max = tValue.hasOwnProperty('max') ? tValue.max : Infinity;
	var min = this.min = tValue.hasOwnProperty('min') ? tValue.min : -Infinity;
	var rate = this.rate = tValue.hasOwnProperty('rate') ? tValue.rate : 0;
	var interval = this.interval = tValue.hasOwnProperty('interval') ? tValue.interval : 1;

	if (!tValue.hasOwnProperty('val')) {
		set('val', 0);
	}

	this.set = function (value) {
		var oldVal = this.get();
		var newVal = Math.max(min, Math.min(max, value));

		if (oldVal >= max && newVal < max) {
			set('last', this.now());
		}

		set('val', newVal);
	};

	this.inc = function (value) {
		this.set(this.get() + value);
	};

	if (ticks) {
		if (hasSetFunction) {
			tValue.val.on('readable', tick);
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
