Loaded.js
==========

Loaded.js is a small Node.js load testing framework with a focus on flexibility and test organization. Loaded.js takes a
a very minimal approach on how to specify a load test leaving a lot of work to the developer. This approach is particularly
useful when load testing more complex requests and advanced workflows.

Performance metrics / stats
---------------------------

Loaded.js does not automatically gather statistics on test execution performance. Gathering stats on the target application's
performance is best done directly from the applications environment itself. If you're serious about your application's
performance consider tracking performance metrics from the application using `StatsD`, `Logstash/Kibana` or something similar
(also in production!).

Having said that, Loaded.js comes with a stopwatch utility able to track execution times in milliseconds. Multiple
stopwatches can be organized in a hierarchy to organize timers.

### Single stopwatch

TODO

### Hierarchical stopwatch

TODO

Detailed example
----------------

TODO

Dependencies
------------

This library relies heavily on [Async.js](https://github.com/caolan/async).

Tests
-----

To run tests and check code style, run the following command from the command line:

    grunt

The test run will also run a code coverage tool that outputs an overview on the command line.
More detailed output can be found in the `/coverage` directory.