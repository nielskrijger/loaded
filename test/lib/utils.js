'use strict';

var assert = require('chai').assert;
var utils = require('../../lib/utils');

describe('lib/utils.js', function () {

    describe('#sort()', function () {
        it('should sort an array of numbers in ascending order', function () {
            var numbers = [78, 45, 12, 43, 45];
            utils.sort(numbers);
            assert.deepEqual(numbers, [12, 43, 45, 45, 78]);
        });
    });

    describe('#max()', function () {
        it('should return the highest number in an array of numbers', function () {
            var numbers = [78, 45, 12, 43, 45];
            assert.deepEqual(utils.max(numbers), 78);
        });
    });

    describe('#min()', function () {
        it('should return the lowest number in an array of numbers', function () {
            var numbers = [78, 45, 12, 43, 45];
            assert.deepEqual(utils.min(numbers), 12);
        });
    });

    describe('#sum()', function () {
        it('should return the sum of an array of numbers', function () {
            var numbers = [78, 45, 12, 43, 45];
            assert.deepEqual(utils.sum(numbers), 223);
        });
    });

    describe('#mean()', function () {
        it('should return the mean of an array of numbers', function () {
            var numbers = [78, 45, 12, 43, 45];
            assert.deepEqual(utils.mean(numbers), 44.6);
        });
    });

    describe('#median()', function () {
        it('should return the average that indicates the upper half of an array with an even number of elements', function () {
            var numbers = [78, 49, 12, 43, 45, 44];
            var result = utils.median(numbers);
            assert.equal(result, 44.5);
        });

        it('should return the average that indicates the upper half of an array with an odd number of elements', function () {
            var numbers = [78, 49, 12, 45, 44];
            var result = utils.median(numbers);
            assert.equal(result, 45);
        });
    });

    describe('#percentile()', function () {
        it('should return the 50% percentile', function () {
            var numbers = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
            var result = utils.percentile(numbers, 50);
            assert.equal(result, 5);
        });

        it('should return the 57% percentile', function () {
            var numbers = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
            var result = utils.percentile(numbers, 57);
            assert.equal(result, 6);
        });

        it('should return the 90% percentile', function () {
            var numbers = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
            var result = utils.percentile(numbers, 90);
            assert.equal(result, 9);
        });

        it('should return the 95% percentile', function () {
            var numbers = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
            var result = utils.percentile(numbers, 95);
            assert.equal(result, null);
        });
    });
});