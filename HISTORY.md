### History

## v0.3.0

* Fixed an issue where timed number was not ticking if the previous stored value and the new stored value were the same.
* Fixed an issue where tick timers were not being set properly.
* Ticks now only occur when the value is not at it's limits.
* Fixed an issue where negative rates could not be used properly.

## v0.2.2

* Fixed an issue where last was not getting updated to the last tick when set is called and you aren't at the max value.
