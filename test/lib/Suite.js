'use strict';

var Suite = require('../../lib/Suite');
var stopwatch = require('../../lib/timer');
var assert = require('chai').assert;

describe('lib/Suite.js', function () {

    beforeEach(function () {
        stopwatch.clear();
    });

    describe('#run()', function () {
        it('should run multiple beforeAll functions, afterAll functions and tests', function (done) {
            var test = new Suite('test', 50, 5);
            var beforeAllCount = 0;
            var testCount = 0;
            var afterAllCount = 0;

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
                    var timer = stopwatch.start('test.1');
                    setTimeout(function () {
                        timer.stop();
                        next(null, 'test');
                    }, Math.round(Math.random() * 10));
                },
                function (var1, next) {
                    testCount++;
                    assert.equal(var1, 'test');
                    var timer = stopwatch.start('test.2');
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
            test.run(function (err) {
                assert.equal(beforeAllCount, 1);
                assert.equal(testCount, 50);
                assert.equal(afterAllCount, 1);
                done();
            });
        });

        it('should run a single beforeAll function, afterAll function and test', function (done) {
            var test2 = new Suite('test', 50, 5);
            var beforeAllCount = 0;
            var testCount = 0;
            var afterAllCount = 0;
            test2.beforeAll(function (next) {
                beforeAllCount++;
                next(null, 'test');
            });
            test2.test(function (n, next) {
                testCount++;
                next(null, 'test');
            });

            test2.afterAll(function (next) {
                afterAllCount++;
                next(null, 'test');
            });
            test2.run(function (err) {
                assert.equal(beforeAllCount, 1);
                assert.equal(testCount, 50);
                assert.equal(afterAllCount, 1);
                done();
            });
        });
    });
});