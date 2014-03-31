Loaded.js
==========

Loaded.js is a small Node.js load testing framework with a focus on flexibility and test organization. Loaded.js takes a
a very minimal approach on how to specify a load test leaving a lot of work to the developer. This approach is particularly
useful when load testing more complex requests and advanced workflows.

HTTP Request example
--------------------

The following example requests the google homepage 50 times with a max of 5 concurrent users.

    var request = require('request');
    var loaded = require('loaded');

    var loadTest = loaded.newTest({
        iterations: 50,
        concurrency: 5
    });
    loadTest.test(function (n, next) {
        request('http://www.google.com', function (error, response, body) {
            if (error) {
                next(error);
            } else if (response.statusCode < 200 || response.statusCode >= 300) {
                next(response.statusCode + ' ' + body);
            } else if (!error && response.statusCode == 200) {
                console.log('Iteration ' + n);
                next();
            }
        });
    });
    loadTest.run(function () {
        console.log('Finished');
    });

You can specify timers and multiple `beforeAll`, `afterAll` and `test` functions. See the detailed example for more information.

Test options
------------

When creating a test you can pass an object with the following options:

 - `title`: an optional test title. Defaults to ''.
 - `iterations`: the number of iterations. Defaults to 1.
 - `concurrency`: the number of tests to run in parallel.
 - `errorHandler`: an error handling function called when an error is detected in `beforeAll`, `afterAll` or `test` functions.
 The error handler signature is `function(err)`. Defaults printing the error to the console.

Performance metrics / stats
---------------------------

Loaded.js does not automatically gather statistics on test execution performance. Gathering stats of the target application's
performance is best done directly from the applications environment itself. If you're serious about your application's
performance consider tracking performance metrics from the application using `StatsD`, `Logstash/Kibana` or something similar
(also in production!).

Having said that, Loaded.js comes with a timer utility able to track execution times in milliseconds. Multiple
timers can be organized in a hierarchy to organize timers.

### Single timer

Timers are identified by their name. You can start multiple timers with the same name. Results of timers with the same name
are aggregated in the stats report (see below).

    var loaded = require('loaded');

    var loadTest = loaded.newTest({
        iterations: 200,
        concurrency: 20
    });
    loadTest.test(function (n, next) {
        var timer = loaded.newTimer('test');
        setTimeout(function () {
            timer.stop();
            next(null);
        }, Math.round(Math.random() * 100));
    });
    loadTest.run(function () {
        console.log(loaded.stats());
    });

Example output:

    {
        test: {
            count: 200,
            sum: 10508,
            mean: 52.54,
            median: 55.5,
            min: 1,
            max: 100,
            '90percentile': 90,
            '95percentile': 96,
            '99percentile': 100
         }
     }

### Multiple timers (hierarchical)

You can create a timer hierarchy where lower levels are aggregated in upper levels. To do this simply separate timer hierarchy
levels with a dot, for example:

    var loaded = require('loaded');

    var loadTest = loaded.newTest({
        iterations: 200,
        concurrency: 20
    });
    loadTest.test([
        function (n, next) {
            var timer = loaded.newTimer('test.1');
            setTimeout(function () {
                timer.stop();
                next();
            }, Math.round(Math.random() * 100));
        },
        function (next) {
            var timer = loaded.newTimer('test.2');
            setTimeout(function () {
                timer.stop();
                next();
            }, Math.round(Math.random() * 50));
        }
    ]);
    loadTest.run(function () {
        console.log(loaded.stats());
    });

Example output:

    {
        test: {
            count: 400,
            sum: 14595,
            mean: 36.4875,
            median: 32,
            min: 1,
            max: 101,
            '90percentile': 81,
            '95percentile': 93,
            '99percentile': 99
        },
        'test.1': {
            count: 200,
            sum: 9482,
            mean: 47.41,
            median: 47,
            min: 1,
            max: 101,
            '90percentile': 93,
            '95percentile': 98,
            '99percentile': 99
        },
        'test.2': {
            count: 200,
            sum: 5113,
            mean: 25.565,
            median: 26,
            min: 1,
            max: 51,
            '90percentile': 45,
            '95percentile': 48,
            '99percentile': 50
        }
    }

Detailed example
----------------

The following example specifies multiple `beforeAll`, `afterAll` and `test` functions. In addition the first `test`
passes an additional parameter to the next `test`.

    var loaded = require('loaded');

    var loadTest = loaded.newTest({
        title: 'Detailed load test example',
        iterations: 10,
        concurrency: 20
    });
    loadTest.beforeAll([
        function (next) {
            next(null, 'Before all');
        },
        function (var1, next) {
            console.log(var1);
            next();
        }
    ]);
    loadTest.test([
        function (n, next) {
            var timer = loaded.newTimer('test.1');
            setTimeout(function () {
                timer.stop();
                next(null, 'Iteration ' + n);
            }, Math.round(Math.random() * 100));
        },
        function (var1, next) {
            var timer = loaded.newTimer('test.2');
            setTimeout(function () {
                console.log(var1);
                timer.stop();
                next();
            }, Math.round(Math.random() * 50));
        }
    ]);
    loadTest.afterAll([
        function (next) {
            next(null, 'After all');
        },
        function (var1, next) {
            console.log(var1);
            next();
        }
    ]);
    loadTest.run(function () {
        console.log(loaded.stats());
    });

Example output:

    Before all
    Iteration 1
    Iteration 3
    Iteration 7
    Iteration 5
    Iteration 9
    Iteration 4
    Iteration 6
    Iteration 2
    Iteration 8
    Iteration 10
    After all
    {
        test: {
            count: 20,
            sum: 781,
            mean: 39.05,
            median: 33,
            min: 11,
            max: 94,
            '90percentile': 75,
            '95percentile': 94,
            '99percentile': null
        },
        'test.1': {
            count: 10,
            sum: 517,
            mean: 51.7,
            median: 47,
            min: 21,
            max: 94,
            '90percentile': 94,
            '95percentile': null,
            '99percentile': null
        },
        'test.2': {
            count: 10,
            sum: 264,
            mean: 26.4,
            median: 29.5,
            min: 11,
            max: 41,
            '90percentile': 41,
            '95percentile': null,
            '99percentile': null
        }
    }

Dependencies
------------

This library relies heavily on [Async.js](https://github.com/caolan/async).

Tests
-----

To run tests and verify the code style, run the following command from the command line:

    grunt

The test run will also run a code coverage tool that outputs a code coverage overview on the command line.
More detailed output can be found in the generated `/coverage` directory.