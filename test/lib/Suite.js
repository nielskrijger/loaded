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
            var test = new Suite({
                title: 'test',
                iterations: 50,
                concurrency: 5,
                progressInterval: 100
            });
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
            test.run(function () {
                assert.equal(test.title, 'test');
                assert.equal(beforeAllCount, 1);
                assert.equal(testCount, 50);
                assert.equal(afterAllCount, 1);
                done();
            });
        });

        it('should run a single beforeAll function, afterAll function and test', function (done) {
            var test = new Suite({
                iterations: 50,
                concurrency: 5
            });
            var beforeAllCount = 0;
            var testCount = 0;
            var afterAllCount = 0;
            test.beforeAll(function (next) {
                beforeAllCount++;
                next(null, 'test');
            });
            test.test(function (n, next) {
                testCount++;
                next(null, 'test');
            });

            test.afterAll(function (next) {
                afterAllCount++;
                next(null, 'test');
            });
            test.run(function () {
                assert.equal(beforeAllCount, 1);
                assert.equal(testCount, 50);
                assert.equal(afterAllCount, 1);
                done();
            });
        });

        it('should handle errors correctly', function (done) {
            var errorCount = 0;
            var testCount = 0;
            var test = new Suite({
                iterations: 50,
                concurrency: 5,
                errorHandler: function (err) {
                    assert.equal('Error', err);
                    errorCount++;
                }
            });
            test.test(function (n, next) {
                testCount++;
                next('Error');
            });
            test.run(function () {
                assert.equal(testCount, 50);
                assert.equal(errorCount, 50);
                done();
            });
        });

        it('should fail when no tests are set', function (done) {
            var errorCount = 0;
            var test = new Suite({
                errorHandler: function (err) {
                    assert.equal('No tests are set', err);
                    errorCount++;
                }
            });
            test.run(function () {
                assert.equal(errorCount, 1);
                done();
            });
        });

        it('should set default options', function (done) {
            var test = new Suite();
            test.test(function (n, next) {
                next();
            });
            test.run(function () {
                assert.equal(test.title, '');
                assert.equal(test.concurrency, 1);
                assert.equal(test.iterations, 1);
                assert.equal(typeof test.errorHandler, 'function');
                done();
            });
        });
    });
});