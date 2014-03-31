'use strict';

var assert = require('chai').assert;
var async = require('async');
var stats = require('../../lib/stats');
var timer = require('../../lib/timer');

describe('lib/stats.js', function () {

    describe('#stats()', function () {
        it('should gather stats and report on stats', function (done) {
            async.times(5, function (n, next) {
                var timerA = timer.start('a');
                setTimeout(function () {
                    timerA.stop();
                    next();
                }, 50);
            }, function (err) {
                async.times(98, function (n, next) {
                    var timerAB = timer.start('a.b');
                    setTimeout(function () {
                        timerAB.stop();
                        next();
                    }, 20);
                }, function (err) {
                    var report = stats.report(timer.getAll());
                    assert.equal(report['a'].count, 103);
                    assert(report['a'].sum >= 2210 && report['a'].sum < 2400);
                    assert(report['a'].median >= 20 && report['a'].median <= 25);
                    assert(report['a'].mean >= 20 && report['a'].mean <= 25);
                    assert(report['a'].min >= 20 && report['a'].min <= 25);
                    assert(report['a'].max >= 50 && report['a'].min <= 55);
                    assert(report['a']['90percentile'] >= 20 && report['a']['90percentile'] < 50);
                    assert(report['a']['95percentile'] >= 50);
                    assert(report['a']['99percentile'] >= 50);
                    assert.equal(report['a.b'].count, 98);
                    assert(report['a.b'].sum >= 1960 && report['a.b'].sum < 2200);
                    assert(report['a.b'].median >= 20 && report['a.b'].median <= 25);
                    assert(report['a.b'].mean >= 20 && report['a.b'].mean <= 25);
                    assert(report['a.b'].min >= 20 && report['a.b'].min <= 25);
                    assert(report['a.b'].max >= 20 && report['a.b'].min <= 25);
                    assert(report['a.b']['90percentile'] >= 20);
                    assert(report['a.b']['95percentile'] >= 20);
                    assert.equal(report['a.b']['99percentile'], null);
                    done();
                });
            });
        });
    });
});