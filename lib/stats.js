/**
 * @module stats
 * @fileoverview The `stats` is a simple utility library to do time tracking.
 * @author Niels Krijger
 */

'use strict';

var utils = require('./utils');


module.exports.report = function (stopwatches) {

    // Organize stopwatches in a hierarchy (denoted by dots in stopwatch names)
    var hierarchy = createStopwatchHierarchy(stopwatches);

    // Generates stats report
    return generateReport(hierarchy);
};

function createStopwatchHierarchy(stopwatches) {
    var result = {};
    var timers = stopwatches.filter(function (entry) {
        return entry.time !== null; // Remove running stopwatches from stats
    });
    for (var i = 0, max = timers.length; i < max; i++) {
        var pieces = timers[i].name.split('.'); // Names such as 'a.b.c' are counted as 'a', 'a.b' and 'a.b.c'.
        var key = null;
        for (var j = 0, jMax = pieces.length; j < jMax; j++) {

            // For each new array element, extend the previous key with the new piece (e.g. first 'a', second loop 'a.b')
            key = (key !== null) ? key + '.' + pieces[j] : pieces[j];

            // Push element to the result set
            if (!result[key]) {
                result[key] = [];
            }
            result[key].push(timers[i].time);
        }
    }
    return result;
}

function generateReport(hierarchy) {
    var result = {};
    for (var property in hierarchy) {
        if (hierarchy.hasOwnProperty(property)) {
            result[property] = stats(hierarchy[property]);
        }
    }
    return result;
}

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