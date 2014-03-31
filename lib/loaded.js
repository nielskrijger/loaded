/**
 * @module loaded
 * @fileoverview Exposes the Loaded.js API.
 * @author Niels Krijger
 */

'use strict';

var Suite = require('./Suite');
var timer = require('./timer');
var stats = require('./stats');
var ProgressBar = require('progress');

/**
 * Creates a new test.
 *
 * @param {TestOptions} options The test options.
 */
module.exports.newTest = function (options) {
    var suite = new Suite(options);
    if (options.progressInterval) {
        var progressBar = new ProgressBar('Progress [:bar] :percent, time: :elapsed, ETA: :etas', {
            complete: '=',
            incomplete: ' ',
            width: 50,
            total: 100
        });
        suite.on('progress', function (iteration, total) {
            console.log('Iteration: ' + iteration + ' from total ' + total + ' tick: ' + (Math.round(iteration / total * 100)));
            progressBar.tick(Math.round(iteration / total * 100) - progressBar.curr);
        });
    }
    return suite;
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