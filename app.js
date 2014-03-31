'use strict';

var request = require('request');
var loaded = require('./lib/loaded');

var loadTest = loaded.newTest({
    iterations: 500,
    concurrency: 5,
    progressInterval: 2000
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