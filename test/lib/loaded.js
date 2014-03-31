'use strict';

var assert = require('chai').assert;
var loaded = require('../../lib/loaded');

var beforeAllCount = 0;
var testCount = 0;
var afterAllCount = 0;

var test = loaded.test('test', 50, 5);
test.beforeAll([
    function (next) {
        next(null, 'test');
    },
    function (var1, next) {
        assert.equal(var1, 'test');
        beforeAllCount++;
        next();
    }
]);
test.test([
    function (n, next) {
        var timer = loaded.newTimer('test.1');
        setTimeout(function () {
            timer.stop();
            next(null, 'test');
        }, Math.round(Math.random() * 10));
    },
    function (var1, next) {
        testCount++;
        assert.equal(var1, 'test');
        var timer = loaded.newTimer('test.2');
        setTimeout(function () {
            timer.stop();
            next();
        }, Math.round(Math.random() * 10));
    }
]);
test.afterAll([
    function (next) {
        next(null, 'test');
    },
    function (var1, next) {
        assert.equal(var1, 'test');
        afterAllCount++;
        next();
    }
]);

describe('lib/loaded.js', function () {

    beforeEach(function () {
        loaded.clearTimers();
    });

    describe('#stats()', function () {
        it('should gather stats and report on stats', function (done) {
            test.run(function () {
                assert.equal(beforeAllCount, 1);
                assert.equal(testCount, 50);
                assert.equal(afterAllCount, 1);

                var stats = loaded.stats();
                assert.equal(stats['test'].count, 100);
                assert.equal(stats['test.1'].count, 50);
                assert.equal(stats['test.2'].count, 50);

                // We may assume the rest of the stats are correct, these are tested in other tests
                done();
            });
        });
    });
});