/**
 * @module Suite
 * @fileoverview The `Suite` groups one or more tests which are run in isolation of other test suites.
 * @author Niels Krijger
 */

'use strict';

var async = require('async');

/**
 * The Test suite organizes a series of tests and runs them concurrently multiple times.
 * @type {Suite}
 */
module.exports = Suite;

/**
 * Initialize a new test `Suite` with the given `title`.
 *
 * @param {TestOptions} options The testsuite options.
 */
function Suite(options) {

    if (!options) {
        options = {};
    }

    /**
     * The test Suite title.
     * @type {String}
     */
    this.title = (options.title) ? options.title : '';

    /**
     * The number of times to repeat the test.
     * @type {Number}
     */
    this.iterations = (options.iterations) ? options.iterations : 1;

    /**
     * The maximum number of workers running in parallel.
     * @type {Number}
     */
    this.concurrency = (options.concurrency) ? options.concurrency : 1;

    /**
     * The error handler function.
     *
     * @type {Function}
     */
    this.errorHandler = (options.errorHandler) ? options.errorHandler : function (err) {
        console.error('An error occurred', err);
    };

    this._beforeAll = [];
    this._afterAll = [];
    this._tests = [];
    this._currentIteration = 0;
}

/**
 * @typedef TestOptions
 * @type {Object}
 * @property {String} [title] The Test title. Defaults to an empty string.
 * @property {Number} [iterations] The number of times to repeat the test. Defaults to 1.
 * @property {concurrency} [concurrency] The number of concurrent users. Defaults to 1.
 * @property {Function} [errorHandler] The function to handle errors. Defaults to `console.error(...)`.
 */

/**
 * Executes tests in parallel and executes `beforeAll` and `afterAll` functions.
 *
 * @param {Function} done A callback called after the test Suite has finished.
 */
Suite.prototype.run = function (done) {
    if (this._tests.length == 0) {
        this.errorHandler('No tests are set');
        return done();
    }
    async.waterfall(this._beforeAll, function (err) {
        if (err) {
            this.errorHandler(err);
            return done();
        }
        var q = async.queue(function (task, callback) {
            this._pushNext(q);
            task(callback);
        }.bind(this), this.concurrency);
        this._pushNext(q);
        q.drain = function () {
            async.waterfall(this._afterAll, function (err) {
                if (err) {
                    this.errorHandler(err);
                }
                done();
            });
        }.bind(this);
    }.bind(this));
};

/**
 * Sets the test or array of tests.
 *
 * The specified tests contain the main logic of your load test, usually a HTTP request or socket message.
 *
 * When specifying multiple tests in an array these will be executed sequentially. Parameters from a test
 * can be passed to the next by adding them to the callback (see examples).
 *
 * @param {Function|Function[]} test A function or array of functions that execute your load testing logic. The
 * function or first function of the array must have the following signature:
 * `function(n, next)` where `n` is the current iteration and `next` is a callback. When passing an array
 * of functions any subsequent function must have the following signature: `function([arg1,] [arg...,] next)`
 * where `arg1` and `arg...` are optional parameters passed to `next` in the previous function, and `next`
 * is the callback.
 */
Suite.prototype.test = function (test) {
    if (test instanceof Array) {
        this._tests = test;
    } else {
        this._tests.push(test);
    }
};

/**
 * Defines one or more functions executed before any tests are run.
 *
 * @param {Function|Function[]} beforeAll A function or array of functions executed before any tests are run.
 * The function or first function of the array must have the following signature: `function(next)` where `next`
 * is a callback. When passing an array of functions any subsequent function must have the following
 * signature: `function([arg1,] [arg...,] next)` where `arg1` and `arg...` are optional parameters passed
 * to `next` in the previous function, and `next` is the callback.
 */
Suite.prototype.beforeAll = function (beforeAll) {
    if (beforeAll instanceof Array) {
        this._beforeAll = beforeAll;
    } else {
        this._beforeAll.push(beforeAll);
    }
};

/**
 * Defines one or more functions executed after all tests are finished.
 *
 * @param {Function|Function[]} beforeAll A function or array of functions executed before any tests are run.
 * The function or first function of the array must have the following signature: `function(next)` where `next`
 * is a callback. When passing an array of functions any subsequent function must have the following
 * signature: `function([arg1,] [arg...,] next)` where `arg1` and `arg...` are optional parameters passed
 * to `next` in the previous function, and `next` is the callback.
 */
Suite.prototype.afterAll = function (afterAll) {
    if (afterAll instanceof Array) {
        this._afterAll = afterAll;
    } else {
        this._afterAll.push(afterAll);
    }
};

/**
 * Adds a test to the queue if the number of iterations has not yet exceeded the maximum number of
 * iterations. When successfull the iteration count is increased by 1.
 *
 * @param {Function} queue The queue.
 * @private
 */
Suite.prototype._pushNext = function (queue) {
    if (this._currentIteration < this.iterations) {
        this._currentIteration++;
        var tests = this._prepareTests(this._tests, this._currentIteration);
        queue.push(function (done) {
            async.waterfall(tests, function (err) {
                if (err) {
                    this.errorHandler(err);
                }
                done();
            }.bind(this));
        }.bind(this));
    }
};

/**
 * Adds an additional function to the method chain of tests to pass the specified iteration number `n`
 * to the first test.
 *
 * @param {Function[]} tests The method chain of tets.
 * @param {Number} n The current iteration number.
 * @returns {Function[]} A copy of the `tests` array with the addition of an additional function in the beginning
 * that calls callback with specified `n`.
 * @private
 */
Suite.prototype._prepareTests = function (tests, n) {
    var methodChain = tests.slice(0); // Copy array
    methodChain[0] = function (callback) {
        tests[0](n, callback);
    };
    return methodChain;
};