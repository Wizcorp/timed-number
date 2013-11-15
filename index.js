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

	this.now = function (value) {
		return Date.now() / 1000 << 0;	
	}

	var tValue = tSource;

	// Set up some sane default values.

	if (!tValue.hasOwnProperty('last')) {
		set('last', 0);
	}

	this.last = tValue.last;

	var max = this.max = tValue.hasOwnProperty('max') ? tValue.max : Infinity;
	var min = this.min = tValue.hasOwnProperty('min') ? tValue.min : -Infinity;
	var rate = this.rate = tValue.hasOwnProperty('rate') ? tValue.rate : 0;

	if (!tValue.hasOwnProperty('val')) {
		set('val', 0);
	}

	this.val = tValue.val;

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
};

module.exports = TimedNumber;