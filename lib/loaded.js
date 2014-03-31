/**
 * @module loaded
 * @fileoverview Exposes the Loaded.js API.
 * @author Niels Krijger
 */

'use strict';

var util = require('util');
var Suite = require('./Suite');
var timer = require('./timer');
var stats = require('./stats');

/**
 * Creates a new test.
 *
 * @param {TestOptions} options The test options.
 */
module.exports.newTest = function (options) {
    return new Suite(options);
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
 * Returns a statistics report of all stored timers.
 *
 * @returns {Object} A statistics object.
 */
module.exports.stats = function () {
    return stats.report(timer.getAll());
};