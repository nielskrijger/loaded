/**
 * @module utils
 * @fileoverview Contains math utility functions.
 * @author Niels Krijger
 */

'use strict';

/**
 * Sorts an array of numbers in ascending order.
 *
 * @param {Number[]} values An array.
 * @returns {void}
 */
module.exports.sort = function sort(values) {
    values.sort(function (a, b) {
        return a - b;
    });
};

/**
 * Returns the number that identifies the higher half of the array.
 *
 * As a side-effect this method sorts the specified `values`. If you do no want this to happen make a copy first.
 *
 * @param {Number[]} values An array of numbers.
 * @returns {Number} The number that identifies the higher half of the array.
 */
module.exports.median = function median(values) {
    this.sort(values);
    var half = Math.floor(values.length / 2);
    if (values.length % 2) {
        return values[half];
    } else {
        return (values[half - 1] + values[half]) / 2.0;
    }
};

/**
 * Returns the first number higher than specified percentage of other numbers.
 *
 * As a side-effect this method sorts the specified `values`. If you do no want this to happen make a copy first.
 *
 * @param {Number[]} values An array of numbers.
 * @param {Number} percentile The percentage, a number between 0 and 100.
 * @return {Number} The first number higher than specified percentage of other numbers. Returns `null` when no
 * number exists.
 */
module.exports.percentile = function (values, percentile) {
    this.sort(values);
    var index = values.length * (percentile / 100);
    var result = null;
    if (index % 1 !== 0) {
        index = Math.ceil(index);
    }
    if (values[index]) {
        result = values[index];
    }
    return result;
};

/**
 * Returns the sum of an array of numbers.
 *
 * @param {Number[]} values An array of numbers.
 * @returns {Number} The sum of all numbers.
 */
module.exports.sum = function sum(values) {
    return values.reduce(function (a, b) {
        return a + b;
    });
};

/**
 * Returns the maximum number from an array of numbers.
 *
 * @param {Number[]} values An array of numbers.
 * @returns {Number} The highest number in `values`.
 */
module.exports.max = function max(values) {
    return Math.max.apply(null, values);
};

/**
 * Returns the minimum number from an array of numbers.
 *
 * @param {Number[]} values An array of numbers.
 * @returns {Number} The minimum number in `values`.
 */
module.exports.min = function min(values) {
    return Math.min.apply(null, values);
};

/**
 * Returns the average of an array of numbers.
 *
 * @param {Number[]} values An array of numbers.
 * @returns {Number} The average number of `values`.
 */
module.exports.mean = function min(values) {
    return this.sum(values) / values.length;
};