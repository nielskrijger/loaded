/**
 * @module loaded
 * @fileoverview Exposes the Loaded.js API.
 * @author Niels Krijger
 */

'use strict';

var Suite = require('./Suite');
var timer = require('./timer');
var stats = require('./stats');

/**
 * Creates a new test.
 *
 * @param {String} title The test title.
 * @param {Number} iterations The number of times to repeat the test.
 * @param {Number} concurrency Determines how many workers are run in parallel.
 */
module.exports.test = function (title, iterations, concurrency) {
    return new Suite(title, iterations, concurrency);
};

/**
 * Creates and starts a new timer with specified name.
 *
 * @param {String} name The timer name. Names do not have to be unique.
 * @returns {Timer} A timer.
 */
module.exports.newTimer = function (name) {
    return timer.start(name);
};

/**
 * Removes all stored timers.
 */
module.exports.clearTimers = function () {
    timer.clear();
};

/**
 * Returns a reports
 *
 * @returns {*}
 */
module.exports.stats = function () {
    return stats.report(timer.getAll());
};