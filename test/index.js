var assert = require('assert');
var Tome = require('tomes').Tome;

var TimedNumber = require('..');

describe('Timed Values', function () {
	it('throws when trying to instantiate with nothing', function () {
		assert.throws(function () {
				return new TimedNumber();
			}, Error
		);
	});

	it('throws when trying to instantiate on a number', function () {
		assert.throws(function () {
				return new TimedNumber(7);
			}, Error
		);
	});

	var testForce = {
		max: 3,
		min: 0,
		rate: 1 / (30 * 60),
		val: 3
	};

	var tForce = Tome.conjure(testForce);

	var tvForce = new TimedNumber(tForce);

	it('First get returns the initial value.', function () {
		assert.equal(3, tvForce.get());
		assert.equal(tvForce.get(), tForce.val);
	});

	it('Setting the value higher than the maximum results in the maximum being set.', function () {
		tvForce.set(10);
		assert.equal(3, tvForce.get());
	});

	it('The tome\'s value is kept up to date.', function () {
		assert.equal(tvForce.get(), tForce.val);
	})

	it('Setting the value lower than the minimum results in the minimum being set.', function () {
		tvForce.set(-10);
		assert.equal(0, tvForce.get());
	});

	it('The tome\'s value is kept up to date.', function () {
		assert.equal(tvForce.get(), tForce.val);
	})

	it('Setting the value updates the last property to the current time received from the now function.', function () {
		tvForce.now = function () { return 1234567890; };
		tvForce.set(0);
		assert.equal(1234567890, tForce.last);
	});

	it('Getting the value 10 seconds later should result in the same value.', function () {
		tvForce.now = function () { return 1234567890; };
		var previousValue = tvForce.get();
		tvForce.now = function () { return 1234567890 + 10; };
		assert.equal(previousValue, tvForce.get());
	});

	it('Getting the value 30 minutes later should result in an increase by one.', function () {
		tvForce.now = function () { return 1234567890; };
		var previousValue = tvForce.get();
		tvForce.now = function () { return 1234567890 + 30 * 60; };
		assert.equal(previousValue + 1, tvForce.get());
	});

	it('Getting the value 60 minutes later should result in an increase by two.', function () {
		tvForce.now = function () { return 1234567890; };
		var previousValue = tvForce.get();
		tvForce.now = function () { return 1234567890 + 60 * 60; };
		assert.equal(previousValue + 2, tvForce.get());
	});

	it('Getting the value 90 minutes later should result in an increase by three.', function () {
		tvForce.now = function () { return 1234567890; };
		var previousValue = tvForce.get();
		tvForce.now = function () { return 1234567890 + 90 * 60; };
		assert.equal(previousValue + 3, tvForce.get());
	});

	it('Getting the value 2 hours later should result in an increase by three.', function () {
		tvForce.now = function () { return 1234567890; };
		var previousValue = tvForce.get();
		tvForce.now = function () { return 1234567890 + 2 * 60 * 60; };
		assert.equal(previousValue + 3, tvForce.get());
	});

	it('Getting the value 1 week later should result in an increase by three.', function () {
		tvForce.now = function () { return 1234567890; };
		var previousValue = tvForce.get();
		tvForce.now = function () { return 1234567890 + 7 * 24 * 60 * 60; };
		assert.equal(previousValue + 3, tvForce.get());
	});
});

describe('Two different timers.', function () {
	var hp, tvHP;
	it('Can setup a TimedNumber that runs on milliseconds.', function () {
		hp = {
			last: Date.now(),
			max: 10000,
			min: 0,
			rate: 1 / 100, // 1 hp per 100ms.
			val: 10000
		};

		tvHP = new TimedNumber(hp);
		tvHP.now = function () { return Date.now(); };

		assert.equal(tvHP.get(), 10000);
	});

	it('We can decrement the TimedNumber by 1000.', function () {
		tvHP.inc(-1000);
		assert.equal(tvHP.get(), 9000);
	});

	it('Waiting 100ms increases the TimedNumber by 1.', function (done) {
		var beforeWait = Date.now();
		setTimeout(function () { assert.equal(9001, tvHP.get()); done(); }, 100);
	});
});

describe('Ticking', function () {
	it('Listen for a tick event', function (done) {
		var hp = {
			max: 10000,
			min: 0,
			rate: 1 / 100, // 1 hp per 100ms
			val: 1000,
			interval: 1
		};

		var tvHP = new TimedNumber(hp);
		tvHP.once('tick', function (value) {
			assert(value, 1010);
			done();
		});
	});
});