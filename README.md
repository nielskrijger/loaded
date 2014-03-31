Loaded.js
==========

[![Build Status via Travis CI](https://travis-ci.org/nielskrijger/loaded.png?branch=master)](https://travis-ci.org/nielskrijger/loaded)

Loaded.js is a small Node.js load testing framework with a focus on flexibility and test organization. Loaded.js takes a
a very minimal approach on how to specify a load test leaving a lot of work to the developer. This approach is particularly
useful when load testing more complex requests and advanced workflows.

In its current form Loaded.js requires

HTTP Request example
--------------------

The example below requests the google homepage 50 times with a max of 5 concurrent users.

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

To run the test, copy and paste the code snippet in a file (for example `test.js`) and run the following commands:

    $ npm install loaded
    $ npm install request
    $ node test.js

You can specify timers and multiple `beforeAll`, `afterAll` and `test` functions. See the detailed example below for more information.

Test options
------------

When creating a test you can pass an object with the following options:

 - `title`: a test title. Defaults to ''.
 - `iterations`: the number of iterations. Defaults to 1.
 - `concurrency`: the number of tests to run in parallel. Defaults to 1.
 - `errorHandler`: an error handling function called when an error is detected in `beforeAll`, `afterAll` or `test` functions.
 The error handler signature is `function(err)`. Defaults to printing the error to the console.
 - `progressInterval`: the number of milliseconds to print a progress status to the console. When `0` or `null` disables the
 progress bar. Defaults to `null`.

Performance metrics / stats
---------------------------

Loaded.js does not automatically gather statistics on test execution performance. Gathering stats of the target application's
performance is best done directly from the environment itself. If you're serious about your application's performance consider
tracking performance metrics from the application using `StatsD`, `Logstash/Kibana` or something similar (also in production!).

Having said that, Loaded.js comes with a timer utility able to track execution times in milliseconds.

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

You can create a timer hierarchy to aggregate statistics of different timers. To do this simply separate timer hierarchy
levels with a dot in the timer's name, for example:

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

Notice the two timers `test.1` and `test.2` produce three timer outputs: `test.1`, `test.2` and `test` (the latter
being the aggregate of the other two timers).

Detailed example
----------------

The following example specifies multiple `beforeAll`, `afterAll` and `test` functions. In addition the first `test`
passes an additional parameter to the next `test`.

    var loaded = require('loaded');

    var loadTest = loaded.newTest({
        title: 'Detailed load test example',
        iterations: 10,
        concurrency: 3
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
                next(null, 'Iteration ' + n + ', ' + timer.time + 'ms');
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
    Iteration 1, 19ms
    Iteration 3, 57ms
    Iteration 5, 1ms
    Iteration 2, 76ms
    Iteration 4, 83ms
    Iteration 7, 52ms
    Iteration 8, 18ms
    Iteration 9, 2ms
    Iteration 10, 19ms
    Iteration 6, 102ms
    After all
    {
        test: {
            count: 20,
            sum: 742,
            mean: 37.1,
            median: 37.5,
            min: 1,
            max: 102,
            '90percentile': 83,
            '95percentile': 102,
            '99percentile': null
        },
        'test.1': {
            count: 10,
            sum: 429,
            mean: 42.9,
            median: 35.5,
            min: 1,
            max: 102,
            '90percentile': 102,
            '95percentile': null,
            '99percentile': null
        },
        'test.2': {
            count: 10,
            sum: 313,
            mean: 31.3,
            median: 37.5,
            min: 5,
            max: 46,
            '90percentile': 46,
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

Version history
---------------

v0.1.1
- Updated documentation
- Added progress bar with progress interval

v0.1.0
- Initial release