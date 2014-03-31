/**
 * @module stats
 * @fileoverview The `stats` is a simple utility library to do time tracking.
 * @author Niels Krijger
 */

'use strict';

var utils = require('./utils');

/**
 * Generates a report with various statistics such as mean, median and range of all specified Timers.
 *
 * The report generator splits timer's titles by a dot character and organizes the timed results in a
 * hierarchy where each upper level contains the aggregate of all lower levels. For example, two
 * timers with one timer title `a.b` and a second timer `a.c` will have a report listing for `a`
 * containing both the results of `a.b` and `a.c` in addition to the individual timers.
 *
 * @param {Timer[]} timers An array of Timers.
 * @returns {Object} A statistics report of all `timers`.
 */
module.exports.report = function (timers) {

    // Organize timers in a hierarchy (hierarchy levels are separated by dots in the timer's name)
    var hierarchy = createTimerHierarchy(timers);

    // Generates stats report
    return generateReport(hierarchy);
};

/**
 * Generates a map of time results based on the hierarchy specified in the Timer's title.
 *
 * Hierarchy in Timer's are specified in the Timer's title by separating each level with a dot.
 * For example, a Timer with title 'a.b' is part of the upper level 'a' and sublevel 'a.b'. As
 * a result its timed values are added to both levels.
 *
 * @private
 * @param {Timer[]} timers An array of Timers.
 * @returns {Object} A map where each key contains a Timer's title and the value contains an array of numbers.
 */
function createTimerHierarchy(timers) {
    var result = {};
    var running = timers.filter(function (entry) {
        return entry.time !== null; // Remove running stopwatches from stats
    });
    for (var i = 0, max = running.length; i < max; i++) {
        var pieces = running[i].name.split('.'); // Names such as 'a.b.c' are counted as 'a', 'a.b' and 'a.b.c'.
        var key = null;
        for (var j = 0, jMax = pieces.length; j < jMax; j++) {

            // For each new array element, extend the previous key with the new piece (e.g. first 'a', second loop 'a.b')
            key = (key !== null) ? key + '.' + pieces[j] : pieces[j];

            // Push element to the result set
            if (!result[key]) {
                result[key] = [];
            }
            result[key].push(running[i].time);
        }
    }
    return result;
}

/**
 * Generates a statistics report from a map of time results.
 *
 * @private
 * @param {Object[]} times A map where each key contains a Timer's title and the value contains an array of numbers.
 * @returns {Object} An report with various stats of each timer in the specified `hierarchy`.
 */
function generateReport(times) {
    var result = {};
    for (var property in times) {
        if (times.hasOwnProperty(property)) {
            result[property] = stats(times[property]);
        }
    }
    return result;
}

/**
 * Generates a list of statistics such as count, sum and range from an array of numbers.
 *
 * @private
 * @param {Number[]} values An array of numbers.
 * @returns {Object} An object containing the count, sum, mean, median, range and common percentile statistics of `values`.
 */
function stats(values) {
    return {
        count: values.length,
        sum: utils.sum(values),
        mean: utils.mean(values),
        median: utils.median(values),
        min: utils.min(values),
        max: utils.max(values),
        '90percentile': utils.percentile(values, 90),
        '95percentile': utils.percentile(values, 95),
        '99percentile': utils.percentile(values, 99)
    };
}