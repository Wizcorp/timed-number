var assert = require('assert');
var Tome = require('tomes').Tome;

var TimedNumber = require('..');

var time = 1234567890;

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
		interval: 60 * 30,
		max: 3,
		min: 0,
		rate: 1,
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
		tvForce.now = function () { return time; };
		tvForce.set(0);
		assert.equal(time, tForce.last);
	});

	it('Getting the value 10 seconds later should result in the same value.', function () {
		tvForce.now = function () { return time; };
		var previousValue = tvForce.get();
		tvForce.now = function () { return time + 10; };
		assert.equal(previousValue, tvForce.get());
	});

	it('Getting the value 30 minutes later should result in an increase by one.', function () {
		tvForce.now = function () { return time; };
		var previousValue = tvForce.get();
		tvForce.now = function () { return time + 30 * 60; };
		assert.equal(previousValue + 1, tvForce.get());
	});

	it('Getting the value 60 minutes later should result in an increase by two.', function () {
		tvForce.now = function () { return time; };
		var previousValue = tvForce.get();
		tvForce.now = function () { return time + 60 * 60; };
		assert.equal(previousValue + 2, tvForce.get());
	});

	it('Getting the value 90 minutes later should result in an increase by three.', function () {
		tvForce.now = function () { return time; };
		var previousValue = tvForce.get();
		tvForce.now = function () { return time + 90 * 60; };
		assert.equal(previousValue + 3, tvForce.get());
	});

	it('Getting the value 2 hours later should result in an increase by three.', function () {
		tvForce.now = function () { return time; };
		var previousValue = tvForce.get();
		tvForce.now = function () { return time + 2 * 60 * 60; };
		assert.equal(previousValue + 3, tvForce.get());
	});

	it('Getting the value 1 week later should result in an increase by three.', function () {
		tvForce.now = function () { return time; };
		var previousValue = tvForce.get();
		tvForce.now = function () { return time + 7 * 24 * 60 * 60; };
		assert.equal(previousValue + 3, tvForce.get());
	});
});

describe('Two different timers.', function () {
	var hp, tvHP;
	it('Can setup a TimedNumber that runs on seconds.', function () {
		hp = {
			last: Date.now() / 1000 << 0,
			interval: 1,
			max: 10000,
			min: 0,
			rate: 1,
			val: 10000
		}

		tvHP = new TimedNumber(hp);
		tvHP.now = function () { return Date.now() / 1000 << 0; };

		assert.equal(tvHP.get(), 10000);
	});

	it('We can decrement the TimedNumber by 1000.', function () {
		tvHP.inc(-1000);
		assert.equal(tvHP.get(), 9000);
	});

	it('Waiting 1s increases the TimedNumber by 1.', function (done) {
		setTimeout(function () { assert.equal(9001, tvHP.get()); done(); }, 1000);
	});
});

describe('ticks', function () {
	it('finalTick', function () {
		var now = Date.now() / 1000 >> 0;
		var hp = {
			interval: 1,
			last: now,
			max: 2000,
			min: 0,
			rate: 10, // 10 hp per 1s
			val: 1000
		};

		var tvHP = new TimedNumber(hp);
		assert.equal(tvHP.finalTick(), now + 100);
	});

	it('lastTick', function () {
		var now = Date.now() / 1000 >> 0;
		var hp = {
			interval: 9,
			last: now - 10,
			max: 10000,
			min: 0,
			rate: 10, // 10 hp per 1s
			val: 1000
		};

		var tvHP = new TimedNumber(hp);
		assert.equal(tvHP.lastTick(), now - 1);
	});

	it('nextTick', function () {
		var now = Date.now() / 1000 >> 0;
		var hp = {
			interval: 10,
			last: now,
			max: 2000,
			min: 0,
			rate: 10, // 10 hp per 1s
			val: 1000
		};

		var tvHP = new TimedNumber(hp);
		assert.equal(tvHP.nextTick(), now + 10);
	});
});

describe('Ticking', function () {
	it('Listen for a tick event', function (done) {
		var hp = {
			interval: 1,
			max: 10000,
			min: 0,
			rate: 10, // 10 hp per 1s
			val: 1000
		};

		var tvHP = new TimedNumber(hp, true);
		tvHP.once('tick', function (value) {
			assert(value, 1010);
			done();
		});
	});
});
