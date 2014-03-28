/**
 * @module stopwatch
 * @fileoverview The `stopwatch` is a simple utility library to do time tracking.
 * @author Niels Krijger
 */

'use strict';

var stopwatches = [];

/**
 * Starts a new stopwatch with specified name.
 *
 * @param {String} name The stopwatch name. Names do not have to be unique.
 * @returns {{name: String, start: Number, time: Number, stop: Function}} A stopwatch
 */
module.exports.start = function (name) {
    var stopwatch = {
        name: name,
        start: Date.now(),
        time: null,
        stop: function () {
            this.time = Date.now() - this.start;
        }
    };
    stopwatches.push(stopwatch);
    return stopwatch;
};

/**
 * Returns all stopwatches (both running and non-running).
 *
 * @returns {Object[]} An array of all running and non-running stopwatches.
 */
module.exports.getAll = function () {
    return stopwatches;
};

/**
 * Removes all stored stopwatches.
 */
module.exports.clear = function () {
    stopwatches = [];
};