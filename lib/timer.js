/**
 * @module timer
 * @fileoverview The `timer` is a simple utility library to track time.
 * @author Niels Krijger
 */

'use strict';

var timers = [];

/**
 * Creates and starts a new timer with specified name.
 *
 * @param {String} name The timer name. Names do not have to be unique.
 * @returns {Timer} A timer.
 */
module.exports.start = function (name) {

    /**
     * @typedef Timer
     * @type {Object}
     * @property {String} name The Timer's name.
     * @property {Number} start The start time in milliseconds.
     * @property {Number|null} time The number of milliseconds the Timer ran before it was stopped.
     * @property {Function} stop Stops the Timer and sets or updates the `time`.
     */
    var newTimer = {
        name: name,
        start: Date.now(),
        time: null,
        stop: function () {
            this.time = Date.now() - this.start;
        }
    };
    timers.push(newTimer);
    return newTimer;
};

/**
 * Returns all timers (both running and non-running).
 *
 * @returns {Object[]} An array of all running and non-running timers.
 */
module.exports.getAll = function () {
    return timers;
};

/**
 * Removes all stored timers.
 */
module.exports.clear = function () {
    timers = [];
};