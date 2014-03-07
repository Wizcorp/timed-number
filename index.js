var EventEmitter;

try {
	EventEmitter = require('emitter');
} catch (e) {
	EventEmitter = require('events').EventEmitter;
}

if (!EventEmitter) {
	throw new Error('Could not find EventEmitter, TimedNumber cannot start.');
}

function inherits(Child, Parent) {
	Child.prototype = Object.create(Parent.prototype, {
		constructor: { value: Child, enumerable: false, writable: true, configurable: true }
	});
}

var TimedNumber = function (tSource) {
	if (typeof tSource !== 'object') {
		throw new Error('You must instantiate TimedNumber with an Object.');
	}

	// Detect if we're using something that has a setter, ie. tomes.

	var hasSetFunction = typeof Object.getPrototypeOf(tSource).set === 'function';

	function set(key, value) {
		if (hasSetFunction) {
			tValue.set(key, value);
		} else {
			tValue[key] = value;
		}
	}

	this.now = function () {
		return Date.now() / 1000 << 0;
	};

	var tValue = this.source = tSource;

	// Set up some sane default values.

	if (!tValue.hasOwnProperty('last')) {
		set('last', 0);
	}

	this.last = tValue.last;

	var max = this.max = tValue.hasOwnProperty('max') ? tValue.max : Infinity;
	var min = this.min = tValue.hasOwnProperty('min') ? tValue.min : -Infinity;
	var rate = this.rate = tValue.hasOwnProperty('rate') ? tValue.rate : 0;
	var interval = this.interval = tValue.hasOwnProperty('interval') ? tValue.interval : 0;

	if (!tValue.hasOwnProperty('val')) {
		set('val', 0);
	}

	this.get = function () {
		var diff = this.now() - tValue.last;
		var calc = tValue.val + ((diff * tValue.rate) << 0); // bitwise operator is faster than Math.floor

		return Math.max(tValue.min, Math.min(tValue.max, calc));
	};

	this.set = function (value) {
		newVal = Math.max(tValue.min, Math.min(tValue.max, value));
		newLast = this.now();

		set('val', newVal);
		set('last', newLast);
	};

	this.inc = function (value) {
		this.set(this.get() + value);
	};

	var that = this;

	function tick() {
		that.emit('tick', that.get());
		lastTick = that.now();
	}

	var ticker, lastTick;
	if (interval) {
		ticker = setInterval(tick, interval * 1000);
	}

	this.nextTick = function () {
		return lastTick + interval;
	};

	this.finalTick = function () {
		var direction = rate > 0 ? this.max : this.min;
		return Math.abs((this.val - direction) / rate);
	};
};

inherits(TimedNumber, EventEmitter);

module.exports = TimedNumber;